const monster = require("../models/monster");
const memory = require("memory-cache");

/**
 * 搜尋怪物
 * @param {String} name 怪物名稱
 * @param {Boolean} strict 嚴謹搜尋
 * @param {Object} filter 篩選器
 * @returns {Promise<Array>}
 */
exports.searchByName = (name, strict = false, filter) => {
  let query = monster()
    .select("*")
    .where("name", strict ? "=" : "like", `%${name}%`)
    .orderBy("level", "asc");

  if (filter.isNormal) {
    query.where(function () {
      this.where("name", "like", "▲%").orWhere("name", "like", "●%");
    });
  }

  return query;
};

/**
 * 直接透過id查詢怪物
 * @param {Number} id
 * @returns {Promise<Object>}
 */
exports.find = id => {
  return monster().first("*").where("id", "=", id);
};

exports.getColumnNames = async () => {
  let data = memory.get("MONSTER_COLUMNS");
  if (data) return data;

  let names = await monster()
    .first("*")
    .then(res => Object.keys(res));

  memory.put("MONSTER_COLUMNS", names);

  return names;
};

/**
 * 指定篩選器進行搜尋
 * @param {Object} filter
 * @param {Array<{key: String, value, operation: String}>} filter.attributes
 */
exports.search = filter => {
  let query = monster().select("*");

  if (filter.attributes) {
    filter.attributes.forEach(attr => query.where(attr.key, attr.operation || "=", attr.value));
  }

  return query;
};
