const sqlite = require("../../utils/sqlite")("tthol.sqlite");
const table = "magic";

module.exports = () => sqlite(table);
