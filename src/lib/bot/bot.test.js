const crypto = require("crypto");
const express = require("express");
const { router, route, text, run } = require("./router");
const { LineContext } = require("./context");
const { createWebhookHandler } = require("./webhook");

const textEvent = (msg, sourceType = "user") => ({
  type: "message",
  replyToken: "token-1",
  source: { type: sourceType, userId: "U1" },
  message: { type: "text", text: msg },
});

function makeContext(rawEvent) {
  const client = { replyMessage: jest.fn().mockResolvedValue({}) };
  return { client, context: new LineContext({ client, rawEvent }) };
}

describe("router", () => {
  const app = () =>
    router([
      text(/^\.?(item|物品)\s(?<item>\d+)$/, (ctx, props) =>
        ctx.replyText(`id:${props.match.groups.item}`)
      ),
      text(/^\.?(item|物品)\s/, ctx => ctx.replyText("search")),
      route("*", ctx => ctx.replyText("fallback")),
    ]);

  it.each([
    ["物品 123", "id:123"],
    ["item abc", "search"],
    ["hello", "fallback"],
  ])("%s -> %s (first match wins, named groups in props.match)", async (msg, expected) => {
    const { client, context } = makeContext(textEvent(msg));
    await run(app, context);
    await context.handlerDidEnd();
    expect(client.replyMessage).toHaveBeenCalledWith({
      replyToken: "token-1",
      messages: [{ type: "text", text: expected }],
    });
  });

  it("text() regex does not match non-text events", async () => {
    const { client, context } = makeContext({ type: "follow", replyToken: "t", source: {} });
    await run(router([text(/.*/, ctx => ctx.replyText("x"))]), context);
    await context.handlerDidEnd();
    expect(client.replyMessage).not.toHaveBeenCalled();
  });
});

describe("LineContext", () => {
  it("batches replyText + replyFlex into one reply call", async () => {
    const { client, context } = makeContext(textEvent("hi"));
    context.replyText("a");
    context.replyFlex("alt", { type: "bubble" });
    await context.handlerDidEnd();
    expect(client.replyMessage).toHaveBeenCalledTimes(1);
    expect(client.replyMessage.mock.calls[0][0].messages).toEqual([
      { type: "text", text: "a" },
      { type: "flex", altText: "alt", contents: { type: "bubble" } },
    ]);
  });

  it("exposes event fields used by controllers, message.text stays mutable", () => {
    const { context } = makeContext(textEvent("orig"));
    expect(context.event.isText).toBe(true);
    expect(context.event.source.type).toBe("user");
    context.event.message.text = "changed";
    expect(context.event.text).toBe("changed");
  });
});

describe("webhook", () => {
  const secret = "test-secret";
  let server, url, client;

  beforeAll(done => {
    client = { replyMessage: jest.fn().mockResolvedValue({}) };
    const app = () => router([route("*", ctx => ctx.replyText("pong"))]);
    const e = express();
    e.use("/webhooks/line", createWebhookHandler({ app, channelSecret: secret, client }));
    server = e.listen(0, () => {
      url = `http://127.0.0.1:${server.address().port}/webhooks/line`;
      done();
    });
  });
  afterAll(() => {
    server.closeAllConnections();
    return new Promise(resolve => server.close(() => resolve()));
  });

  const post = (body, signature) =>
    fetch(url, {
      method: "POST",
      headers: Object.assign(
        { "content-type": "application/json" },
        signature ? { "x-line-signature": signature } : {}
      ),
      body,
    });
  const sign = body => crypto.createHmac("sha256", secret).update(body).digest("base64");

  it("rejects missing / bad signature", async () => {
    const body = JSON.stringify({ events: [] });
    expect((await post(body)).status).toBe(401);
    expect((await post(body, sign("other"))).status).toBe(401);
  });

  it("ACKs a signed request and replies via client", async () => {
    const body = JSON.stringify({ destination: "x", events: [textEvent("ping")] });
    expect((await post(body, sign(body))).status).toBe(200);
    await new Promise(r => setTimeout(r, 50));
    expect(client.replyMessage).toHaveBeenCalledWith({
      replyToken: "token-1",
      messages: [{ type: "text", text: "pong" }],
    });
  });

  it("skips LINE console verify events", async () => {
    client.replyMessage.mockClear();
    const ev = Object.assign(textEvent("x"), { replyToken: "00000000000000000000000000000000" });
    const body = JSON.stringify({ events: [ev] });
    expect((await post(body, sign(body))).status).toBe(200);
    await new Promise(r => setTimeout(r, 50));
    expect(client.replyMessage).not.toHaveBeenCalled();
  });
});
