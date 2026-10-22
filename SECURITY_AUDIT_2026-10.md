# tthol-line-bot 資安盤查報告（2026-10）

- 盤查日期：2026-10-22；修補完成：2026-10-22
- 範圍：本 repo、`yarn.lock`、Dockerfile、GitHub Actions、GHCR 映像、正式機 EC2 `i-0fb9f6d0d54948df2`（`hanshino-app`，ap-east-2）
- 方法：`yarn audit`、OSV API（`yarn audit` registry 後期 timeout，改用 OSV，依 GHSA 去重）、`docker buildx imagetools inspect`、EC2 Instance Connect 唯讀查詢、原始碼 grep
- 修補 PR：hanshino/tthol-line-bot#17（runtime / build hardening）、#18（移除 Bottender）、#19（better-sqlite3、carousel 修正、CI、清理）、#20（glob 相依更新、本報告定稿）

---

## A. Executive Summary

| 項目 | 修補前 | 修補後（正式機已驗證） |
|---|---|---|
| Node.js runtime | 24.19.0（受 2026-10-21 安全更新 4 High 影響） | **24.22.1** |
| 容器 OS | Debian 11 bullseye（EOL） | **Debian 12 bookworm** |
| Production 相依 Critical / High（依 GHSA 去重） | 3 / 43 | **0 / 0**（剩 Moderate 4 個，見 B-2） |
| Bottender（2022 起停止維護） | 1.5.5 | **已移除**，改 `@line/bot-sdk` 11.3.0 + 自建相容層 `src/lib/bot/` |
| sqlite3（install 時帶 node-gyp / tar 6.x） | 5.1.7 | **已改 better-sqlite3 13.0.3**（套件內附 prebuild，`--ignore-scripts` 安裝） |

- 服務數：1（LINE webhook bot，`https://tthol.hanshino.dev`，前端 Caddy `caddy:2-alpine`）
- 已確認不適用：PHP、Next.js / RSC、Laravel、NGINX / njs（正式機無 nginx、php；proxy 為 Caddy，`~/stack/Caddyfile:31-32`）
- 範圍外：Mac 開發機的 Node（v24.19.0）與 PHP（8.5.4），使用者自行升級
- 沒有 P0；P1、P2 均已修補並上線（Mac 開發機除外）

---

## B. 漏洞盤查表

### B-1. 本次指定盤查項目

| # | 元件 | CVE/GHSA | 嚴重度 | 修補前版本與來源 | 修補版本 | 是否受影響／依據 | 對外暴露 | 處理 | 優先級 / 狀態 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Node.js runtime（production） | CVE-2026-105482、105483、106069、111497（High）；105481、106072、106074（Medium）；106073（Low）；106070、106071 只影響 26.x | High | 24.19.0：GHCR `latest` 映像 `NODE_VERSION`（2026-08-12 建置）；正式容器 `docker exec … node -v` = v24.19.0 | 24.22.1 | 受影響（版本面）。可利用性偏低：入站 body-parser 不解 Brotli；出站只用 hostname 連 LINE / Google | webhook 服務本身 | PR #17 換基底映像 | P1 / **已修補** |
| 2 | Docker 基底 tag | 同上（根因） | High | `Dockerfile:1` `node:lts-bullseye-slim`，registry 停在 24.20.0（最後建置 2026-08-27），重新 build 也修不好 | — | 受影響 | — | 改 `node:24.22.1-bookworm-slim@sha256:55fb5f5a…`（digest pin） | P1 / **已修補** |
| 3 | OS Debian 11 bullseye | EOL | High | `Dockerfile:1` | Debian 12 | 受影響（EOL，不再有 backport） | 容器 OS 層 | 同 #2 | P1 / **已修補** |
| 4 | Node.js（dev 映像） | 同 #1 | — | `Dockerfile.dev:1` `node:lts` → 目前解析 24.22.1 | — | 已修補（浮動 tag，本機若有舊 cache 需 `docker pull node:lts`） | 不對外 | — | P2 |
| 5 | Node.js（開發機） | 同 #1 | — | 本 VM v24.22.1；Mac v24.19.0（使用者回報） | 24.22.1 | 本 VM 不受影響；Mac 受影響 | `make cf-go` 開 Quick Tunnel 時本機等同對外（`makefile:70-94`） | Mac 升級 Node | P2 / 使用者自行處理 |
| 6 | Node.js（CI） | — | — | `.github/workflows/main.yml` 只在 docker build 內使用 Node | — | 跟隨 #2 | — | — | 已解決 |
| 7 | PHP | CVE-2026-109618、109619 | — | repo 無 PHP；本 VM、正式機皆無 php；Mac 8.5.4 | 8.5.12 | 本專案不適用 | — | Mac 另行升級 | 範圍外 / 使用者自行處理 |
| 8 | Next.js / RSC | GHSA-673q-mjm6-r5xr、GHSA-2464-fhr4-w9xw、GHSA-p3m5-59mp-jv5r、GHSA-xqc2-xf4c-x3h3、CVE-2026-96889 | — | lockfile 無 `next`、`react-server-dom-*` | — | 不適用（姊妹專案 genbu 需另行盤查） | — | — | — |
| 9 | Laravel | GHSA-f9x3-7vq9-cph6、GHSA-5wcm-3v2w-8362 | — | 無 composer | — | 不適用 | — | — | — |
| 10 | NGINX / njs | CVE-2026-15176、93479、97205、95101、97629 | — | 正式機 proxy 為 Caddy（`stack-caddy-1`、`~/stack/Caddyfile:31-32`），host 無 nginx | — | 不適用。`scripts/nginx-run/001_build.sh` 引用的 `docker-compose.nginx.yml` 不存在，為舊流程殘留 | — | 殘留腳本已刪除（PR #19） | — |

### B-2. 相依 Critical / High（production 相依樹，OSV，依 GHSA 去重）

**已清除**（Bottender 移除、axios 移除、express 4.22.3）：

| 套件 | GHSA | 清除方式 |
|---|---|---|
| proxy-addr 2.0.7 | GHSA-jqcg-44mw-7w3h（Critical） | express 4.22.3 → proxy-addr 2.0.8 |
| form-data 2.3.3 / 2.5.5 / 3.0.4 / 4.0.4 | GHSA-fjxv-7rqg-78g4（Critical）、GHSA-hmw2-7cc7-3qxx | 移除 Bottender、axios |
| axios 0.21.4 / 1.11.0 | 共約 13 個 High（SSRF、prototype pollution gadget、proxy 憑證外洩等） | 移除 Bottender；移除未使用的直接相依 axios |
| path-to-regexp 0.1.12 | GHSA-37ch-88jc-xwx2 | express 4.22.3 → 0.1.13 |
| ws 5.2.4、nanoid 3.3.11、semver 7.0.0、braces、picomatch | 各 High | 移除 Bottender |

**後續清除**（PR #19、#20）：

| 套件 | GHSA | 清除方式 |
|---|---|---|
| tar 6.2.1、tar-fs 2.1.3、http-cache-semantics 4.2.0、ip-address 9.0.5、minimatch 3.1.2、brace-expansion 1.1.12 | GHSA-23hp-3jrh-7fpw（Critical）＋ 14 High | sqlite3 → better-sqlite3，整條 node-gyp / prebuild-install toolchain 移除 |
| lodash 4.17.21 | GHSA-r5fr-rjxr-66jc | knex 3.3.0 → lodash 4.18.1 |
| minimatch 9.0.5、brace-expansion 2.0.2（googleapis → gaxios → rimraf → glob） | 8 High | lockfile 更新至 minimatch 9.0.9、brace-expansion 2.1.7（semver 範圍內） |

**仍存在（Moderate，P2，無需立即處理）**：qs 6.15.3（GHSA-4mjr-xmp4-gh2g、GHSA-x5fp-wj9c-mxmx，經 express/body-parser，本服務只收 JSON）、@messageformat/runtime 3.0.1（GHSA-6xv4-9cqp-92rh，i18n，訊息字串為專案內建）。

dev 相依（eslint、jest）仍有 High（browserslist、flatted、js-yaml、minimatch 3.x 等），只在開發與 CI 使用，不進 production 映像。

### B-3. 設定風險

| # | 項目 | 狀態 |
|---|---|---|
| 1 | `.dockerignore` 沒排除 `.env` | **已修補**（PR #17）；正式容器確認 `/application/.env` 不存在 |
| 2 | CI action 浮動 tag | **已修補**：checkout、setup-buildx pin commit SHA |
| 3 | CI 無 test gate、PR 不跑 build | **已修補**（PR #19）：PR 與 master 都跑 lint + `jest src` + `yarn audit`（僅報告），master build 需 test 通過；PR 只 build 不 push |
| 4 | 多筆怪物／物品查詢的 carousel 超過 LINE 50KB 上限、`物品 劍` 一次送 7 則（上限 5），LINE 拒收 | **已修補**（PR #19）：`src/utils/flex.js` `fitCarousel()`，超出時提示縮小範圍 |
| 5 | `scripts/nginx-run/`、`scripts/run-tasks.sh` 殘留腳本 | **已刪除**（PR #19） |

---

## C. Remediation Plan

### P0
無。

### P1（已完成）
1. Dockerfile 基底 → `node:24.22.1-bookworm-slim`（digest pin）—— PR #17
2. 正式機確認拉到新映像 —— 已驗證

### P2
| 項目 | 狀態 |
|---|---|
| 移除未使用的 axios | 已完成（PR #17） |
| `.dockerignore` 補 `.env`、`node_modules`、`.git` | 已完成（PR #17） |
| 移除 Bottender、改用 `@line/bot-sdk` | 已完成（PR #18） |
| express 4.22.3 | 已完成（PR #18） |
| Mac 開發機 Node ≥ 24.22.1、PHP ≥ 8.5.12 | 使用者於 Mac 自行處理 |
| sqlite3 → `better-sqlite3` | 已完成（PR #19） |
| CI 加 PR build + jest + audit（非阻斷） | 已完成（PR #19） |
| 刪除 `scripts/nginx-run/`、`scripts/run-tasks.sh` 殘留腳本 | 已完成（PR #19） |
| googleapis 下游 minimatch / brace-expansion 更新 | 已完成（PR #20） |

---

## D. 驗證與回滾紀錄

| 階段 | 結果 |
|---|---|
| 修補前基線 | 正式容器映像 `sha256:c1c6a372…`，Node v24.19.0，Debian 11 |
| 本機 build（兩個 PR 各一次） | Node v24.22.1、Debian 12、容器內 `require("sqlite3")` OK、映像內無 `.env`、`/api` → success、未簽章 webhook 被拒 |
| 測試 | `TTHOL_DATABASE=dummy.sqlite npx jest src` 16 passed；eslint OK；CI test job 通過 |
| 指令回歸（PR #18、#19） | 代表性指令走完整 router + 真實 sqlite，回覆送 LINE `/v2/bot/message/validate/reply`：PR #18 時 15/16 為 200（`怪物 1-10` 為既有 B-3 #4）；PR #19 後含多筆查詢全部 200 |
| CI | master build 成功：`b14e8be`（PR #17）、`70aba3f`（PR #18） |
| 正式機（PR #17 後） | `stack-deploy.timer` 自動重建，映像 `sha256:f35da981…`，Node v24.22.1、Debian 12 |
| 正式機（PR #18 後） | 映像 `sha256:6ad2454c…`（= GHCR `latest`），Node v24.22.1，`node_modules` 無 bottender；`https://tthol.hanshino.dev/api` 200；未簽章 webhook 401；容器內以正式 channel secret 簽章送 `物品 發芽嫩草` → 200，handler 執行並呼叫 LINE reply API（假 reply token 回 400，符合預期） |
| Rollback | EC2 `~/stack` compose 改指定 `ghcr.io/hanshino/tthol-line-bot:<前一版 sha>`，或 `git revert` merge commit 讓 CI 重 build；修補前映像 digest 見上 |
| 正式機（PR #19 後） | 映像 `sha256:7378c0fe…`，`node_modules` 有 better-sqlite3、無 sqlite3 / tar；簽章送 `怪物 1-10`、`物品 劍` → 200，handler 執行到 reply 階段。本機以 LINE `validate/reply` 驗證這兩類回覆皆為 200 |
| 修補後再掃描 | OSV（production 相依 174 個套件）：Critical 0 / High 0，Moderate 4 |

## 參考
- Node.js October 21, 2026 Security Releases：https://nodejs.org/en/blog/vulnerability/october-2026-security-releases
- Node.js 24.22.1 release notes：https://nodejs.org/en/blog/release/v24.22.1
- 相依 advisory：GitHub Advisory Database（經 `yarn audit` 與 OSV API 查詢），GHSA ID 如上表
