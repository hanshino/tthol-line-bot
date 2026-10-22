// Minimal replacement for Bottender's LineEvent/LineContext (ported from redive_linebot).
// ponytail: only what this repo uses (text events, replyText/replyFlex); no session/state.

class LineEvent {
  constructor(rawEvent) {
    this._rawEvent = rawEvent;
  }

  get rawEvent() {
    return this._rawEvent;
  }

  get replyToken() {
    return this._rawEvent.replyToken || null;
  }

  get source() {
    return this._rawEvent.source || null;
  }

  get isMessage() {
    return this._rawEvent.type === "message";
  }

  get message() {
    return this._rawEvent.message || null;
  }

  get isText() {
    return this.isMessage && this.message.type === "text";
  }

  get text() {
    return this.isText ? this.message.text : null;
  }
}

class LineContext {
  constructor({ client, rawEvent }) {
    this._client = client;
    this._event = new LineEvent(rawEvent);
    this._replyMessages = [];
  }

  get platform() {
    return "line";
  }

  get client() {
    return this._client;
  }

  get event() {
    return this._event;
  }

  // Replies are batched and sent once in handlerDidEnd (same as Bottender's LINE batching).
  reply(messages) {
    this._replyMessages.push(...messages);
  }

  replyText(text, options) {
    return this.reply([Object.assign({ type: "text", text }, options)]);
  }

  replyFlex(altText, contents, options) {
    return this.reply([Object.assign({ type: "flex", altText, contents }, options)]);
  }

  async handlerDidEnd() {
    if (!this._replyMessages.length || !this._event.replyToken) return;
    await this._client.replyMessage({
      replyToken: this._event.replyToken,
      messages: this._replyMessages,
    });
  }
}

module.exports = { LineEvent, LineContext };
