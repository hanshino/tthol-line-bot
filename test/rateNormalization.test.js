/**
 * 測試機率正規化功能
 */

// 模擬 i18n 函數
const mockI18n = {
  __: key => {
    const translations = {
      "item.str": "外功",
      "item.agi": "身法",
      "item.hp": "體力",
      "item.hit": "命中",
      "item.def": "防禦",
      "item.mdef": "護勁",
      "item.mp": "真氣",
    };
    return translations[key] || key;
  },
};

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
      const attributeName = mockI18n.__(`item.${rand.attribute}`) || rand.attribute;
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

// 測試案例
function testRateNormalization() {
  console.log("=== 測試機率正規化功能 ===\n");

  // 測試案例1：與您提供的實際數據相似
  const testData1 = [
    { attribute: "hit", min: 50, max: 85, rate: 200000 },
    { attribute: "def", min: 55, max: 165, rate: 200000 },
    { attribute: "mdef", min: 55, max: 135, rate: 200000 },
    { attribute: "hp", min: 1550, max: 3100, rate: 200000 },
    { attribute: "mp", min: 1100, max: 2200, rate: 200000 },
  ];

  console.log("測試案例1（原始大數字機率）:");
  console.log("原始數據機率都是 200000");
  console.log("結果:");
  console.log(formatRandomAttributes(testData1));
  console.log("\n");

  // 測試案例2：不同的機率權重
  const testData2 = [
    { attribute: "str", min: 10, max: 20, rate: 50 },
    { attribute: "agi", min: 5, max: 15, rate: 30 },
    { attribute: "hp", min: 100, max: 200, rate: 20 },
  ];

  console.log("測試案例2（不同權重）:");
  console.log("原始機率: 外功(50), 身法(30), 體力(20), 總計: 100");
  console.log("結果:");
  console.log(formatRandomAttributes(testData2));
  console.log("\n");

  // 測試案例3：固定值屬性
  const testData3 = [
    { attribute: "str", min: 15, max: 15, rate: 40 },
    { attribute: "agi", min: 10, max: 20, rate: 60 },
  ];

  console.log("測試案例3（包含固定值）:");
  console.log("原始機率: 外功(40), 身法(60), 總計: 100");
  console.log("結果:");
  console.log(formatRandomAttributes(testData3));
  console.log("\n");
}

// 執行測試
if (require.main === module) {
  testRateNormalization();
}

module.exports = { formatRandomAttributes, testRateNormalization };
