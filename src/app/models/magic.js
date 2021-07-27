const sqlite = require("../../utils/sqlite")(process.env.TTHOL_DATABASE);
const table = "magic";

module.exports = () => sqlite(table);
