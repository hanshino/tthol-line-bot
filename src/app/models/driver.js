const GoogleQuery = require("../../utils/google-query");
const memory = require("memory-cache");
const DRIVER_KEY = "TTHOL_SHEET_DRIVER";

module.exports = async () => {
  let memData = memory.get(DRIVER_KEY);
  if (memData) return memData;

  let data = await GoogleQuery({
    key: process.env.EQUIP_SHEET_KEY,
    type: "json",
    query: "SELECT *",
    gid: process.env.EQUIP_SHEET_DRIVER_GID,
  });

  memory.put(DRIVER_KEY, data);
  return data;
};
