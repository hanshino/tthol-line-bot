const getSheetRows = require("../../utils/googleSheets");
const memory = require("memory-cache");
const DRIVER_KEY = "TTHOL_SHEET_DRIVER";

module.exports = async () => {
  let memData = memory.get(DRIVER_KEY);
  if (memData) return memData;

  let data = await getSheetRows({
    key: process.env.EQUIP_SHEET_KEY,
    gid: process.env.EQUIP_SHEET_DRIVER_GID,
  });

  memory.put(DRIVER_KEY, data, 1000 * 60 * 5);
  return data;
};
