if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const { mountWebhook } = require("./src/lib/bot");
const app = require("./src");

const port = Number(process.env.PORT) || 5000;
const server = express();

mountWebhook(server, {
  app,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
});

server.get("/api", (req, res) => {
  res.send("success");
});

server.listen(port, err => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
