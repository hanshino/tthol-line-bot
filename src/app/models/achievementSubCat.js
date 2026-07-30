const sqlite = require("../../utils/sqlite")(process.env.TTHOL_DATABASE);
const table = "achievement_sub_cats";

module.exports = () => sqlite(table);
