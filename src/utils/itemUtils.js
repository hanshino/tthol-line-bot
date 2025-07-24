/**
 * 格式化隨機素質顯示文字
 * @param {Array} randomAttributes 隨機素質陣列
 * @returns {string} 格式化後的文字
 */
function formatRandomAttributes(randomAttributes) {
  if (randomAttributes.length === 0) return "";

  // 計算總機率用於換算成100%
  const totalRate = randomAttributes.reduce((sum, rand) => sum + rand.rate, 0);

  const randText = randomAttributes
    .map(rand => {
      const attributeName = rand.attribute;
      // 換算成100%基準的機率
      const normalizedRate = totalRate > 0 ? Math.round((rand.rate / totalRate) * 100) : 0;

      if (rand.min === rand.max) {
        return `${attributeName}：${rand.min} (${normalizedRate}%)`;
      } else {
        return `${attributeName}：${rand.min}~${rand.max} (${normalizedRate}%)`;
      }
    })
    .join("\n");

  return `隨機素質：\n${randText}`;
}

module.exports = {
  formatRandomAttributes,
};
