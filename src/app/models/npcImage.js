const sqlite = require("../../utils/sqlite")(process.env.TTHOL_DATABASE);
const table = "npc_images";

module.exports = () => sqlite(table);
