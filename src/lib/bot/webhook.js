const express = require("express");
const {
  middleware,
  messagingApi,
  SignatureValidationFailed,
  JSONParseError,
} = require("@line/bot-sdk");
const { LineContext } = require("./context");
const { run } = require("./router");

const BODY_LIMIT = "1mb";

function report(phase, error) {
  // Do not dump SDK errors: they can carry request headers / access tokens.
  console.error("LINE webhook failure", {
    phase,
    name: error && error.name,
    message: error && error.message,
    status: error && error.status,
  });
}

async function processEvent(app, client, rawEvent) {
  const context = new LineContext({ client, rawEvent });
  try {
    await run(app, context);
  } catch (error) {
    return report("handler", error);
  }
  try {
    await context.handlerDidEnd();
  } catch (error) {
    report("reply", error);
  }
}

function createWebhookHandler({ app, channelSecret, client }) {
  if (typeof app !== "function") throw new TypeError("Missing bot app action");
  const handler = express.Router();

  handler.post(
    "/",
    // Keep the exact signed bytes; the SDK middleware verifies the signature and parses JSON.
    express.raw({ type: () => true, limit: BODY_LIMIT, inflate: false }),
    middleware({ channelSecret }),
    (req, res) => {
      const body = req.body;
      if (!body || !Array.isArray(body.events)) return res.sendStatus(400);
      // ACK first; LINE does not need to wait for DB queries / reply calls.
      res.status(200).end();
      // Skip the console "Verify" dummy events (reply token all 0s / fs).
      const events = body.events.filter(
        event => !(typeof event.replyToken === "string" && /^(0+|f+)$/.test(event.replyToken))
      );
      setImmediate(() =>
        Promise.all(events.map(event => processEvent(app, client, event))).catch(error =>
          report("queue", error)
        )
      );
    }
  );

  handler.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    let status = 500;
    if (error instanceof SignatureValidationFailed) status = 401;
    else if (error.status === 413) status = 413;
    else if (error.type === "encoding.unsupported") status = 415;
    else if (error instanceof JSONParseError || error.status === 400) status = 400;
    if (status === 500) report("request", error);
    return res.sendStatus(status);
  });

  return handler;
}

function mountWebhook(server, { app, channelSecret, channelAccessToken, client }) {
  const lineClient = client || new messagingApi.MessagingApiClient({ channelAccessToken });
  server.use("/webhooks/line", createWebhookHandler({ app, channelSecret, client: lineClient }));
}

module.exports = { createWebhookHandler, mountWebhook };
