# ponytail: pinned by digest; bump tag+digest on Node security releases
FROM node:24.22.1-bookworm-slim@sha256:55fb5f5a527ea2c5c4a95f963e48ef90aa38c7b346054fdc8ee9957a2b55d205

LABEL Name="tthol Line機器人"
LABEL description="非官方，純玩家興趣而寫的機器人"
LABEL version="1.0.0"
LABEL maintainer="hanshino@github"

WORKDIR /application

COPY package.json ./
COPY yarn.lock ./

# better-sqlite3 ships prebuilt binaries; yarn v1 would otherwise run node-gyp because of binding.gyp
RUN yarn install --frozen-lockfile --production --ignore-scripts

ENV NODE_ENV=production

COPY . .

CMD [ "yarn", "start" ]

EXPOSE 5000
