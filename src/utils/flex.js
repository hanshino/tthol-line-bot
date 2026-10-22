// LINE rejects a carousel whose JSON exceeds 50 KB or that has more than 12 bubbles.
// ponytail: measured in UTF-8 bytes with a 50,000 cap (LINE's exact unit is undocumented; bytes is the safe side).
const MAX_BYTES = 50000;
const MAX_BUBBLES = 12;

/**
 * Take as many leading bubbles as fit in one carousel.
 * @param {Array} bubbles
 * @return {{ carousel: Object, shown: number }}
 */
exports.fitCarousel = function fitCarousel(bubbles) {
  const contents = [];
  for (const bubble of bubbles.slice(0, MAX_BUBBLES)) {
    const next = contents.concat([bubble]);
    if (
      contents.length &&
      Buffer.byteLength(JSON.stringify({ type: "carousel", contents: next })) > MAX_BYTES
    )
      break;
    contents.push(bubble);
  }
  return { carousel: { type: "carousel", contents }, shown: contents.length };
};
