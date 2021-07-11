const sqlite = require("../../utils/sqlite")("tthol.sqlite");
const table = "npc";

module.exports = () => sqlite(table);
