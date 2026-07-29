const { google } = require("googleapis");
const memory = require("memory-cache");
const path = require("path");

const TITLE_CACHE_TTL = 1000 * 60 * 30;
const auth = new google.auth.GoogleAuth({
  keyFile:
    process.env.GOOGLE_APPLICATION_CREDENTIALS &&
    path.resolve(__dirname, "../../", process.env.GOOGLE_APPLICATION_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

async function getSheetRows({ key, gid }) {
  const titles = await getSheetTitles(key);
  const title = titles[String(gid)];

  if (!title) {
    throw new Error(`Google Sheet tab not found for gid ${gid}`);
  }

  const range = `'${title.replace(/'/g, "''")}'!A:ZZ`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: key,
    range,
    valueRenderOption: "FORMATTED_VALUE",
  });
  const values = response.data.values || [];
  const headers = values[0] || [];

  return values.slice(1).map(row =>
    headers.reduce((result, header, index) => {
      result[header] = row[index];
      return result;
    }, {})
  );
}

async function getSheetTitles(key) {
  const cacheKey = `GOOGLE_SHEET_TITLES_${key}`;
  const cached = memory.get(cacheKey);
  if (cached) return cached;

  const response = await sheets.spreadsheets.get({
    spreadsheetId: key,
    fields: "sheets.properties(sheetId,title)",
  });
  const titles = {};
  (response.data.sheets || []).forEach(sheet => {
    const properties = sheet.properties;
    titles[String(properties.sheetId)] = properties.title;
  });
  memory.put(cacheKey, titles, TITLE_CACHE_TTL);
  return titles;
}

module.exports = getSheetRows;
module.exports.auth = auth;
