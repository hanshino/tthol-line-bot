const sqlite = require("../../utils/sqlite")(process.env.TTHOL_DATABASE);
const table = "achievement_categories";

module.exports = () => sqlite(table);
