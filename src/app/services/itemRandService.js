const itemRandRepo = require("../repositories/itemRandRepository");

/**
 * 透過物品id查詢隨機素質
 * @param {string} itemId
 * @returns {Promise<Array>}
 */
exports.getByItemId = itemId => {
  return itemRandRepo.findByItemId(itemId);
};

/**
 * 新增隨機素質記錄
 * @param {Object} data
 * @returns {Promise}
 */
exports.create = data => {
  return itemRandRepo.create(data);
};

/**
 * 批量新增隨機素質記錄
 * @param {Array<Object>} dataList
 * @returns {Promise}
 */
exports.createBatch = dataList => {
  return itemRandRepo.createBatch(dataList);
};

/**
 * 更新隨機素質記錄
 * @param {string} itemId
 * @param {string} attribute
 * @param {Object} data
 * @returns {Promise}
 */
exports.update = (itemId, attribute, data) => {
  return itemRandRepo.update(itemId, attribute, data);
};

/**
 * 刪除隨機素質記錄
 * @param {string} itemId
 * @param {string} attribute
 * @returns {Promise}
 */
exports.delete = (itemId, attribute) => {
  return itemRandRepo.delete(itemId, attribute);
};

/**
 * 刪除物品的所有隨機素質記錄
 * @param {string} itemId
 * @returns {Promise}
 */
exports.deleteByItemId = itemId => {
  return itemRandRepo.deleteByItemId(itemId);
};
