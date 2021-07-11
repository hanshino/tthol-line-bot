FROM node:current

LABEL Name="tthol Line機器人"
LABEL description="非官方，純玩家興趣而寫的機器人"
LABEL version="1.0.0"
LABEL maintainer="hanshino@github"

WORKDIR /application

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD [ "yarn", "start" ]

EXPOSE 5000