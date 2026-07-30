const sqlite = require("../../utils/sqlite")(process.env.TTHOL_DATABASE);
const table = "achievements";

module.exports = () => sqlite(table);
