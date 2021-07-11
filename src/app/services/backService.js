const backRepo = require("../repositories/backRepository");

exports.searchByName = name => {
  return backRepo.findByName(name, false);
};

/**
 * 在已經確定名稱的情況下取資料
 * @param {String} name 名稱
 * @returns {Promise<object}
 */
exports.getByName = name => {
  return backRepo.find(name);
};
