const sqlite = require("../../utils/sqlite")(process.env.TTHOL_DATABASE);
const table = "items";

module.exports = () => sqlite(table);
