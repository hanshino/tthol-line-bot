const itemRepo = require("../repositories/itemRepository");

exports.getById = id => {
  return itemRepo.find(id);
};

exports.getByName = (name, filter = {}) => {
  return itemRepo.findByName(name, false, filter);
};

exports.filterByAttributes = (filter = {}) => {
  return itemRepo.filterByAttributes(filter);
};

exports.getColumns = () => {
  return itemRepo.getColumns();
};
