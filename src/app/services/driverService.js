const driverRepo = require("../repositories/driverRepository");

exports.searchByName = name => {
  return driverRepo.findByName(name, false);
};

/**
 * 在已經確定名稱的情況下取資料
 * @param {String} name 名稱
 * @returns {Promise<object}
 */
exports.getByName = name => {
  return driverRepo.find(name);
};
