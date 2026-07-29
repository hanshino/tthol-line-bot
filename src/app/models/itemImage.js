const sqlite = require("../../utils/sqlite")(process.env.TTHOL_DATABASE);
const table = "item_images";

module.exports = () => sqlite(table);
