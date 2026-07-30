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

## LINE Flex Message design rules (learned the hard way — don't re-break these)

Structural JSON validity (`JSON.stringify` succeeds, jest passes) does **not** mean LINE will accept
the message. The only real check is POSTing to LINE's `/v2/bot/message/validate/reply` endpoint with
the real `.env` `LINE_ACCESS_TOKEN`. Treat that as mandatory verification for any Flex template change,
not just eslint+jest.

Invalid properties that look plausible but will 400 at runtime:
- `text` components **cannot** have `backgroundColor`, `cornerRadius`, or any `padding*` — those are
  `box`-only. Want a badge/pill look? Wrap the `text` in a `box` (see `itemTemplate.js`'s `typeBadge()`).
- No `overflow` property exists at all in Flex.
- No `minHeight` — use `height`.
- No bare `padding` shorthand — use `paddingAll`.
- No directional `margin` variants (`marginStart`/`marginEnd`/`marginBottom` are all invalid) — `margin`
  is directionless. Only `padding` has directional variants (`paddingTop/Bottom/Start/End`).
- No `borderStartWidth`/`borderStartColor` — fake an accent bar with a small nested `box` that has its
  own `width`/`backgroundColor`.

**Flex has no child-clipping.** A parent `box` with `border*`/`cornerRadius` does NOT clip a child
`box`'s own square `backgroundColor` — the child's square corners visibly poke out past the parent's
rounded border. This bites alternating-row/striped lists specifically. Convention: don't wrap
alternating-color row lists in a bordered+`cornerRadius` container at all — let rows sit directly on
the section's padding instead (reference: `itemTemplate.js`'s `genStatsBubble`, `monsterTemplate.js`'s
`genAttributeBubble`, `magicTemplate.js`'s `genMagicBubble`).

## Wuxia Flex palette

Reused across `itemTemplate.js` / `monsterTemplate.js` / `magicTemplate.js` / `advanceTemplate.js`.
Each file defines its own local `COLORS` object (deliberate — no shared import) with the same values:

| name | hex | use |
|---|---|---|
| primary/cinnabar | `#b6322d` | headers, primary accents |
| background | `#f9f6f1` | bubble/page background |
| card | `#fcfaf6` | card surfaces |
| ink | `#171b22` | primary text |
| muted | `#585e68` | secondary text |
| border | `#dbd7cf` | dividers, outlines |
| celadon | `#54967a` | secondary accent |
| indigo | `#2c6194` | secondary accent |
| plum | `#744c7d` | secondary accent |

When adding a new Flex template, copy this palette locally rather than importing a shared module
(matches existing convention), and treat the child-clipping rule above as load-bearing for any
striped/alternating-row layout.
