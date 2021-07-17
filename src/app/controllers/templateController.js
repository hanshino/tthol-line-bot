const { text } = require("bottender/router");
const rules = [
  {
    pattern: ["召喚阿克", "聯絡作者"],
    altText: "阿克西斯教萬歲",
    template: require("../templates/authorTemplate").genContactMe(),
  },
];

let routes = rules.map(rule =>
  text(rule.pattern, context => context.sendFlex(rule.altText, rule.template))
);

exports.routes = routes;
