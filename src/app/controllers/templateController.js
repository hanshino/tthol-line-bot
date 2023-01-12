const { text } = require("bottender/router");
const rebornTemplate = require("../templates/rebornTemplate");
const rules = [
  {
    pattern: ["召喚阿克", "聯絡作者"],
    altText: "阿克西斯教萬歲",
    template: require("../templates/authorTemplate").genContactMe(),
  },
  {
    pattern: ["進階書"],
    altText: "主門派進階書選單",
    template: require("../templates/staticTemplate").genMainAdvanceFlex(),
  },
  {
    pattern: /^新轉材?料?$/,
    altText: "新轉材料選單",
    template: rebornTemplate.genNewRebornBubble(),
  },
  {
    pattern: /^舊轉材?料?$/,
    altText: "新轉材料選單",
    template: rebornTemplate.genOldRebornBubble(),
  },
  {
    pattern: /^轉生材?料?$/,
    altText: "轉生解說",
    template: rebornTemplate.genRebornBubble(),
  },
];

let routes = rules.map(rule =>
  text(rule.pattern, context => context.replyFlex(rule.altText, rule.template))
);

exports.routes = routes;
