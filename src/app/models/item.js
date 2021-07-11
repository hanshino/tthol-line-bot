const sqlite = require("../../utils/sqlite")("tthol.sqlite");
const table = "items";

module.exports = () => sqlite(table);
