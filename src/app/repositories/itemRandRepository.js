const itemRand = require("../models/itemRand");

/**
 * 透過物品id查詢隨機素質
 * @param {string} itemId
 * @returns {Promise<Array>}
 */
exports.findByItemId = itemId => {
  return itemRand().select("*").where("id", "=", itemId);
};

/**
 * 新增隨機素質記錄
 * @param {Object} data
 * @param {string} data.id - 物品id
 * @param {string} data.attribute - 屬性
 * @param {number} data.max - 最大值
 * @param {number} data.min - 最小值
 * @param {number} data.rate - 機率
 * @returns {Promise}
 */
exports.create = data => {
  return itemRand().insert(data);
};

/**
 * 批量新增隨機素質記錄
 * @param {Array<Object>} dataList
 * @returns {Promise}
 */
exports.createBatch = dataList => {
  return itemRand().insert(dataList);
};

/**
 * 更新隨機素質記錄
 * @param {string} itemId
 * @param {string} attribute
 * @param {Object} data
 * @returns {Promise}
 */
exports.update = (itemId, attribute, data) => {
  return itemRand().where("id", "=", itemId).where("attribute", "=", attribute).update(data);
};

/**
 * 刪除隨機素質記錄
 * @param {string} itemId
 * @param {string} attribute
 * @returns {Promise}
 */
exports.delete = (itemId, attribute) => {
  return itemRand().where("id", "=", itemId).where("attribute", "=", attribute).del();
};

/**
 * 刪除物品的所有隨機素質記錄
 * @param {string} itemId
 * @returns {Promise}
 */
exports.deleteByItemId = itemId => {
  return itemRand().where("id", "=", itemId).del();
};
