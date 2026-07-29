# AGENTS.md

Code style/conventions for this repo. For commands, architecture, and test gotchas, see `CLAUDE.md`
(loaded alongside this file) — don't duplicate that here.

## Style (enforced by Prettier via `eslint.config.js`, not by hand)

- CommonJS only (`require`/`module.exports` / `exports.foo =`), double quotes, 2-space indent,
  `trailingComma: es5`, `arrowParens: "avoid"` (single-arg arrows have no parens: `x => x`).
- Run `npx eslint . --fix` before considering a change done — it auto-fixes formatting.
- **ESLint here has almost no rules beyond Prettier formatting.** `eslint.config.js` doesn't extend
  any recommended/`no-unused-vars` config — only `prettierConfig.rules` + `prettier/prettier`. It
  will not catch unused vars, undefined-but-declared globals mistakes, etc. Don't rely on lint for
  correctness, only formatting.
- **`languageOptions.ecmaVersion` is `2018`.** Optional chaining (`?.`) and nullish coalescing (`??`)
  are ES2020 syntax and will fail to parse under this config — don't introduce them (none exist in
  `src/` today; grep confirmed). Use `&&`-chains / `|| defaultValue` instead.

## Adding a controller/route

- A controller module must `exports.routes = [...]` (array of Bottender `text(regex, handler)` /
  `route(predicate, handler)` entries) and get spread into `src/index.js`'s `routes` array.
- **First matching route wins** — order in `src/index.js` (and within a controller's own array) is
  significant. Config-driven controllers (`manualController`, `advanceController`) map
  `src/configs/*.config.js` entries 1:1 to routes; add new canned replies there, not as new code.

## Known gotchas worth not re-discovering

- `itemRepository.getColumns()` caches to `memory-cache` with `memory.put("ITEM_COLUMNS", cols)` —
  **no TTL argument, so it never expires** (unlike the Google Sheets cache, which is a 5 min TTL).
  If the `items` table schema changes, the process must restart to pick up new columns.
- i18n untranslated-key filtering: `i18n.__("item.<col>")` returns the key itself when there's no
  translation; controllers filter out any string still starting with `"item."` — that's the whole
  mechanism for hiding untranslated DB columns from users. Don't "fix" a missing attribute by
  changing the filter; add the translation to `locales/zh-tw.json` instead.
- `src/app/repositories/itemRepository.js`'s `TYPE_FILTER`/`resolveType` map the new (post-migration)
  DB schema's `type_name`/`equip_slot` columns to the Chinese `item.type` the rest of the code
  expects (座騎/背飾/帽/衣 via `type_name`; 左飾/中飾/右飾 via `equip_slot`, since all three share
  `type_name = ORNAMENT`). Extend these maps, don't add parallel type-detection logic elsewhere.
- `TTHOL_DATABASE` env var is a bare filename, not a path — `src/utils/sqlite.js` resolves it under
  `storage/`. This is intentional (matches the prod Docker volume mount); don't "fix" it into a path.
