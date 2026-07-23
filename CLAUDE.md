# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A LINE bot for the game 武林同萌傳 (TTHOL): players query item/equipment/monster/magic
data via chat commands and get text or Flex-message replies.

`AGENTS.md` covers code style and conventions (CommonJS, double quotes, 2-space indent,
naming, error-handling patterns) — follow it; this file focuses on commands and architecture.

## Commands

```bash
yarn install          # dependencies
yarn dev              # nodemon server.js (hot reload)
yarn start            # node server.js (defaults to port 5000)
yarn lint             # eslint .   (autofix: npx eslint . --fix)
yarn test             # jest  — but see the test gotcha below
```

Requires a `.env` (copy `.env.example`). Key vars: `LINE_ACCESS_TOKEN`, `LINE_CHANNEL_SECRET`,
`TTHOL_DATABASE` (SQLite filename resolved under `storage/`), and the `EQUIP_SHEET_*` Google
Sheet IDs. Docker: `docker-compose build && docker-compose up -d`.

### Test gotchas (important — a bare `yarn test` fails)

Two independent reasons, both verified:

1. **Jest does not load `.env`** (only `server.js` calls `dotenv`). Model files resolve
   `storage/$TTHOL_DATABASE` at *require* time, so with the var unset every suite throws
   `TypeError: paths[3] ... Received undefined` before any test runs — including `src/index.test.js`.
   Set it (any filename works for the suites that don't actually query): `TTHOL_DATABASE=dummy.sqlite`.
2. **Only `src/index.test.js` is a real Jest suite.** The files under `test/`
   (`itemRandService.test.js`, `rateNormalization.test.js`) are **standalone Node scripts** — no
   `describe`/`it`, guarded by `if (require.main === module)`; `itemRandService.test.js` writes to
   the real DB when run directly. `jest.config.js`'s `testMatch` still globs them, so they register
   zero tests under jest.

So:
- Run the real Jest suite: `TTHOL_DATABASE=dummy.sqlite yarn test src/`.
- Run a `test/` script directly: `node test/rateNormalization.test.js` (pure logic, no DB).

## Architecture

**Stack:** Bottender (bot/routing) on top of Express, Knex over SQLite, plus a Google-Sheets
data source. Entry: `server.js` (Express wrapper, loads `.env` when not production, mounts the
Bottender handler at `/webhooks/line`) → `index.js` → `src/index.js`, whose default export
`App(context)` builds the router on every event.

**Command routing** (`src/index.js`): each controller exports a `routes` array; `src/index.js`
spreads them all in order, then appends `route("*", fallback)`. **First match wins**, so
controller/route order is significant. Routes are Bottender `text(regex, handler)` or
`route(predicate, handler)` entries; handlers read `context.event.message.text` and reply with
`context.replyText` / `context.replyFlex`.

**Layered flow:** `controllers/ → services/ → repositories/ → models/`
- **Controllers** — parse LINE commands (regex, aliases), orchestrate, build replies via templates.
- **Services** — thin pass-through delegation to repositories (little logic of their own).
- **Repositories** — build the query / filter the data.
- **Models** — return the raw data-source handle (see below).

**Two data sources sit behind the model layer:**
- **SQLite via Knex** — a model is `() => sqlite(table)` returning a Knex query builder
  (`src/utils/sqlite.js` → `storage/$TTHOL_DATABASE`). Tables: `items`, `item_rand`, `monsters`,
  `magic`, etc. Repositories chain `.where()/.select()/...` on it.
- **Google Sheets via the gviz SQL API** (`src/utils/google-query.js`) — a model is an async
  fetcher that runs `SELECT *` against a sheet tab and caches the result in `memory-cache` for
  5 min. Used for 座騎 (driver) and 背飾 (back) equipment, which live in sheets, not the DB.

**i18n display filtering (non-obvious):** DB columns are English keys (`str`, `atk`, `def`…);
Chinese display names come from `locales/zh-tw.json` via `i18n.__("item.<col>")` with
`objectNotation`. When a key has no translation, i18n returns the key unchanged (e.g.
`"item.foo"`). Controllers therefore drop any entry whose translated string still
`startsWith("item.")` — that filter is how untranslated columns are hidden from users.

**Config-driven controllers:** `manualController` maps `configs/manual.config.js` entries
straight to text→reply routes; `configs/weighted.config.js` defines the attribute-weighting
formulas used by equipment compare/ranking; `configs/advance.config.js` backs `advanceController`.

**Templates** (`src/app/templates/**`) build the LINE Flex bubbles/carousels; `memory-cache`
also caches the item column list.
