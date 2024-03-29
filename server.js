const express = require("express");
const { bottender } = require("bottender");

const app = bottender({
  dev: process.env.NODE_ENV !== "production",
});

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const port = Number(process.env.PORT) || 5000;

// the request handler of the bottender app
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const verify = (req, _, buf) => {
    req.rawBody = buf.toString();
  };
  server.use(express.json({ verify }));
  server.use(express.urlencoded({ extended: false, verify }));

  server.get("/api", (req, res) => {
    res.send("success");
  });

  // route for webhook request
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
