const magic = require("../models/magic");
const knex = require("../models/model");

/**
 * 根據名稱搜尋技能
 * @param {array} names 名稱，可傳入複合式條件
 * @param {boolean} distinct  是否過濾重複資料
 */
exports.searchByName = (names, distinct = false) => {
  let query = magic().select("*").orderBy("level", "asc");

  names.forEach(name => {
    query.where("name", "like", `%${name}%`);
  });

  if (distinct) {
    query = knex.from(query).select("*").groupBy("name");
  }

  return query;
};

/**
 * @param {number} id
 * @param {number} level
 */
exports.find = (id, level) => {
  let query = magic().first("*").where("id", id).orderBy("level", "desc");

  if (level) {
    query.where("level", level);
  }

  return query;
};

/**
 * 取得此技能的最高等級
 * @param {Number} id
 * @returns
 */
exports.getMaxLevelById = id => {
  return magic().max("level as level").where("id", id).first();
};
