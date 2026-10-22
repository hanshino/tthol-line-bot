const { fitCarousel } = require("./flex");

const bubble = bytes => ({
  type: "bubble",
  body: { type: "box", layout: "vertical", contents: [{ type: "text", text: "x".repeat(bytes) }] },
});

describe("fitCarousel", () => {
  it("stops before exceeding 50 KB", () => {
    const { carousel, shown } = fitCarousel(Array.from({ length: 12 }, () => bubble(12000)));
    expect(shown).toBe(4);
    expect(Buffer.byteLength(JSON.stringify(carousel))).toBeLessThanOrEqual(50000);
  });

  it("caps at 12 bubbles", () => {
    expect(fitCarousel(Array.from({ length: 20 }, () => bubble(10))).shown).toBe(12);
  });

  it("always keeps at least one bubble", () => {
    expect(fitCarousel([bubble(60000)]).shown).toBe(1);
  });
});
