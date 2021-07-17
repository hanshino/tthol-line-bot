const itemRepo = require("../repositories/itemRepository");

exports.getById = id => {
  return itemRepo.find(id);
};

/**
 * 透過名字查詢裝備
 * @param {array<String>} names
 * @param {Object} filter
 * @returns
 */
exports.getByName = (names, filter = {}) => {
  return itemRepo.findByName(names, filter);
};

exports.filterByAttributes = (filter = {}) => {
  return itemRepo.filterByAttributes(filter);
};

exports.getColumns = () => {
  return itemRepo.getColumns();
};

exports.getAllById = (ids, filter = {}, sort = {}) => {
  return itemRepo.getAllById(ids, filter, sort);
};
