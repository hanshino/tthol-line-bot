const sqlite = require("../../utils/sqlite")(process.env.TTHOL_DATABASE);
const table = "item_rand";

module.exports = () => sqlite(table);
