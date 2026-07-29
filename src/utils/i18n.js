const i18n = require("i18n");
const path = require("path");
i18n.configure({
  locales: ["zh-tw"],
  directory: path.join(__dirname, "../../", "locales"),
  objectNotation: true,
  // 手動維護翻譯檔，避免每次遇到未翻譯欄位就自動寫入 key: key 垃圾值
  // （見 AGENTS.md：未翻譯的 key 應手動補進 locales/zh-tw.json，而非改動過濾邏輯）
  updateFiles: false,
});

i18n.setLocale("zh-tw");

module.exports = i18n;
