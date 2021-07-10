const item = require("../models/item");

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
 * @param {string} name 物品名稱
 * @param {boolean} strict 嚴謹模式，是則必須全名符合，否則部分吻合
 * @param {array} filter  可過濾部分資料
 * - type
 * - note
 * @returns {Promise<Array>}
 */
exports.findByName = (name, strict = false, filter = []) => {
  let query = item().select("*");
  query = strict ? query.where("name", "=", name) : query.where("name", "like", `%${name}%`);
  return query;
};
