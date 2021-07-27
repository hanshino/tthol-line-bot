const sqlite = require("../../utils/sqlite")(process.env.TTHOL_DATABASE);
const table = "npc";

module.exports = () => sqlite(table);
