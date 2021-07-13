const item = require("../models/item");
const memory = require("memory-cache");

/**
 * 透過id查詢物品
 * @param {number} id
 * @returns {Promise<Array>}
 */
exports.find = id => {
  return item().select("*").where("id", "=", id);
};

/**
 * 透過名稱搜尋物品
 * @param {array<String} names 物品名稱
 * @param {array} filter  可過濾部分資料
 * - type
 * - note
 * @returns {Promise<Array>}
 */
exports.findByName = (names, filter = {}) => {
  let query = item().select("*");

  names.forEach(name => {
    query.where("name", "like", `%${name}%`);
  });

  if (filter.type) {
    query.where("type", "=", filter.type);
  }

  return query;
};

/**
 * 透過屬性篩選出結果
 * @param {Array} filter
 */
exports.filterByAttributes = filter => {
  let query = item().select("*");

  if (filter.attributes) {
    filter.attributes.forEach(attr => {
      query.where(attr.key, ">=", attr.value);
    });
  }

  if (filter.type) {
    query.where("type", "=", filter.type);
  }

  return query;
};

/**
 * 取得此表的所有欄位名稱
 * @returns {Promise<Array>}
 */
exports.getColumns = async () => {
  let cols = memory.get("ITEM_COLUMNS");
  if (cols) return cols;

  cols = await item()
    .columns([
      "level",
      "hp",
      "mp",
      "str",
      "pow",
      "vit",
      "dex",
      "agi",
      "wis",
      "atk",
      "matk",
      "def",
      "mdef",
      "dodge",
      "uncanny_dodge",
      "critical",
      "hit",
      "speed",
    ])
    .limit(1)
    .then(res => Object.keys(res[0]));

  memory.put("ITEM_COLUMNS", cols);
  return cols;
};
