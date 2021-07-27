const sqlite = require("../../utils/sqlite")(process.env.TTHOL_DATABASE);
module.exports = sqlite;
