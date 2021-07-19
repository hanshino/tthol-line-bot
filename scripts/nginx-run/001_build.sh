#!/usr/bin/env bash

"${COMPOSE_CMD[@]}" -f docker-compose.nginx.yml build
"${COMPOSE_CMD[@]}" -f docker-compose.nginx.yml up -d
