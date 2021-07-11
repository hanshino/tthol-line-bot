const i18n = require("i18n");
const path = require("path");
i18n.configure({
  locales: ["zh-tw"],
  directory: path.join(__dirname, "../../", "locales"),
  objectNotation: true,
});

i18n.setLocale("zh-tw");

module.exports = i18n;
