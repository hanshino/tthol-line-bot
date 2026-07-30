dev: ## 啟動開發伺服器（nodemon，port 5000）
	@yarn dev

cf-up: ## 啟動 Cloudflare Quick Tunnel（背景執行，log 寫到 /tmp/cloudflared.log）
	@if pgrep -x cloudflared > /dev/null; then echo "⚠️  cloudflared is already running"; exit 0; fi && \
	: > /tmp/cloudflared.log && \
	nohup cloudflared tunnel --url http://localhost:5000 --logfile /tmp/cloudflared.log > /dev/null 2>&1 & \
	echo "🚀 cloudflared started (pid $$!). Waiting for URL..." && \
	for i in 1 2 3 4 5 6 7 8 9 10; do \
		URL=$$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/cloudflared.log | head -1) && \
		if [ -n "$$URL" ]; then echo "✅ $$URL"; exit 0; fi; \
		sleep 1; \
	done; \
	echo "❌ Timed out waiting for tunnel URL. Check /tmp/cloudflared.log"; exit 1

cf-down: ## 停止 Cloudflare Quick Tunnel
	@pkill -x cloudflared && echo "🛑 cloudflared stopped" || echo "⚠️  cloudflared was not running"

cf-url: ## 查詢目前 Cloudflare Tunnel 網址
	@grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/cloudflared.log 2>/dev/null | head -1 || echo "cloudflared is not running"

cf-tunnel: ## 一鍵設定 Cloudflare URL 到 LINE webhook
	@CF_URL=$$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' /tmp/cloudflared.log 2>/dev/null | head -1) && \
	if [ -z "$$CF_URL" ]; then echo "❌ cloudflared is not running (try: make cf-up)"; exit 1; fi && \
	$(MAKE) -s _sync-line URL="$$CF_URL"

cf-go: cf-up ## 啟動 cloudflared 並把 URL 同步給 LINE webhook
	@sleep 1 && $(MAKE) -s cf-tunnel

# Internal: sync a public tunnel URL to LINE webhook endpoint.
# Usage: make _sync-line URL=https://example.trycloudflare.com
_sync-line:
	@if [ -z "$(URL)" ]; then echo "❌ URL not provided"; exit 1; fi && \
	TOKEN=$$(grep '^LINE_ACCESS_TOKEN=' .env | cut -d'=' -f2-) && \
	if [ -z "$$TOKEN" ]; then echo "❌ LINE_ACCESS_TOKEN not found in .env"; exit 1; fi && \
	WEBHOOK_URL="$(URL)/webhooks/line" && \
	HTTP_STATUS=$$(curl -s -o /tmp/line-webhook-sync.log -w '%{http_code}' -X PUT https://api.line.me/v2/bot/channel/webhook/endpoint \
		-H "Authorization: Bearer $$TOKEN" \
		-H "Content-Type: application/json" \
		-d "{\"endpoint\": \"$$WEBHOOK_URL\"}") && \
	if [ "$$HTTP_STATUS" != "200" ]; then \
		echo "❌ LINE API rejected webhook update (HTTP $$HTTP_STATUS): $$(cat /tmp/line-webhook-sync.log)"; \
		exit 1; \
	fi && \
	ACTUAL=$$(curl -s https://api.line.me/v2/bot/channel/webhook/endpoint -H "Authorization: Bearer $$TOKEN" | python3 -c 'import json,sys;print(json.load(sys.stdin)["endpoint"])') && \
	if [ "$$ACTUAL" != "$$WEBHOOK_URL" ]; then \
		echo "❌ Verification mismatch: set $$WEBHOOK_URL but LINE reports $$ACTUAL"; \
		exit 1; \
	fi && \
	echo "✅ Webhook verified: $$WEBHOOK_URL"

get-webhook: ## 查詢目前 LINE webhook 設定
	@TOKEN=$$(grep '^LINE_ACCESS_TOKEN=' .env | cut -d'=' -f2-) && \
	curl -s https://api.line.me/v2/bot/channel/webhook/endpoint \
		-H "Authorization: Bearer $$TOKEN" | python3 -m json.tool

help: ## 顯示所有可用指令
	@sed \
		-e '/^[a-zA-Z0-9_\-]*:.*##/!d' \
		-e 's/:.*##\s*/:/' \
		-e 's/^\(.\+\):\(.*\)/$(shell tput setaf 6)\1$(shell tput sgr0):\2/' \
		$(MAKEFILE_LIST) | sort | column -c2 -t -s :
