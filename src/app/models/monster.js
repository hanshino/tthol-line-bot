const sqlite = require("../../utils/sqlite")(process.env.TTHOL_DATABASE);

module.exports = {
  npc: () => sqlite("npc"),
  monster: () => sqlite("monsters"),
};
