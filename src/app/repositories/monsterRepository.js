const { monster, npc } = require("../models/monster");
const memory = require("memory-cache");

/**
 * 搜尋怪物
 * @param {String} name 怪物名稱
 * @param {Boolean} strict 嚴謹搜尋
 * @param {Object} filter 篩選器
 * @returns {Promise<Array>}
 */
exports.searchByName = (name, strict = false, filter) => {
  let query = npc()
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
 * 直接透過id查詢怪物 (npc)
 * @param {Number} id
 * @returns {Promise<Object>}
 */
exports.find = id => {
  return npc().first("*").where("id", "=", id);
};

/**
 * 直接透過id查詢怪物 (monster)
 * @returns {Promise<Array>}
 */
exports.findMonster = id => {
  return monster().first("*").where("id", "=", id);
};

exports.getColumnNames = async () => {
  let data = memory.get("MONSTER_COLUMNS");
  if (data) return data;

  let names = await npc()
    .first("*")
    .then(res => Object.keys(res));

  memory.put("MONSTER_COLUMNS", names);

  return names;
};

/**
 * 指定篩選器進行搜尋
 * @param {Object} filter
 * @param {Object} sort
 * @param {Array<{key: String, value, operation: String, in: Array}>} filter.attributes
 */
exports.search = (filter, sort = {}) => {
  let query = npc().select("*");

  if (sort.orderBy) {
    query.orderBy(sort.orderBy, sort.order || "desc");
  }

  if (filter.attributes) {
    filter.attributes.forEach(attr => {
      if (attr.in) {
        query.whereIn(attr.key, attr.in);
      } else if (attr.value) {
        query.where(attr.key, attr.operation || "=", attr.value);
      }
    });
  }

  return query;
};

/**
 * 搜尋掉落物品包含指定 item id 的怪物
 * @param {Number|String} itemId 物品 ID
 * @param {Object} sort 排序選項
 * @returns {Promise<Array>}
 */
exports.findByDropItem = (itemId, sort = {}) => {
  let query = monster()
    .select("*")
    .whereRaw("drop_item LIKE ?", [`%"${String(itemId)}"%`]);

  if (sort.orderBy) {
    query.orderBy(sort.orderBy, sort.order || "desc");
  } else {
    query.orderBy("level", "asc");
  }

  return query;
};
