const magicRepo = require("../repositories/magicRepository");

exports.searchByName = (names, distinct = false) => {
  return magicRepo.searchByName(names, distinct);
};

exports.find = (id, level) => {
  return magicRepo.find(id, level);
};

exports.getMaxLevelById = id => {
  return magicRepo.getMaxLevelById(id);
};
