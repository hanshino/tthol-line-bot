const knex = require("knex");
const path = require("path");

/**
 * 建立sqlite連線
 * @param {string} filename 會去抓storage下的sqlite檔案
 */
function generate(filename) {
  return knex({
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "../../", "storage", filename),
    },
    useNullAsDefault: true,
  });
}

module.exports = generate;
