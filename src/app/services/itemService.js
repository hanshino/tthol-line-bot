const itemRepo = require("../repositories/itemRepository");

exports.getById = id => {
  return itemRepo.find(id);
};

exports.getByName = (name, filter = {}) => {
  return itemRepo.findByName(name, false, filter);
};
