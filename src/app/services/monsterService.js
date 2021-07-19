const monsterRepo = require("../repositories/monsterRepository");

exports.searchByName = (name, strict = false, filter = {}) => {
  return monsterRepo.searchByName(name, strict, filter);
};

exports.find = id => {
  return monsterRepo.find(id);
};

exports.getColumnNames = () => {
  return monsterRepo.getColumnNames();
};

exports.search = (filter, sort) => {
  return monsterRepo.search(filter, sort);
};
