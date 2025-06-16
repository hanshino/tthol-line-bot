const GoogleQuery = require("../../utils/google-query");
const memory = require("memory-cache");
const BACK_KEY = "TTHOL_SHEET_BACK";

module.exports = async () => {
  let memData = memory.get(BACK_KEY);
  if (memData) return memData;

  let data = await GoogleQuery({
    key: process.env.EQUIP_SHEET_KEY,
    type: "json",
    query: "SELECT *",
    gid: process.env.EQUIP_SHEET_BACK_GID,
  });

  memory.put(BACK_KEY, data, 1000 * 60 * 5);
  return data;
};
