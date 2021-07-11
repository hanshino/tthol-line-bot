這是一份武林同萌傳的`LineBot`專案，可由`docker`直接建置一樣的環境進行開發。

## 事前準備

- `node.js`
- `git`
- `docker (optional)` 
- `tthol.sqlite` 此資料庫為作者自行產出，可跟我聯絡索取

```bash
git clone https://github.com/hanshino/tthol-line-bot.git
cp .env.example .env
```
請將`.env`填寫自己的官方帳號資訊

## 啟動

使用`docker`

```bash
docker-compose build
docker-compose up -d
```

純使用`node.js`

```bash
yarn install
yarn start
```
