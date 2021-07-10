const driverRepo = require("../repositories/driverRepository");

exports.getByName = name => {
  return driverRepo.findByName(name, false);
};
