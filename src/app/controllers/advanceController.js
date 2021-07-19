const advanceConfig = require("../../configs/advance.config");
const { route } = require("bottender/router");
const itemService = require("../services/itemService");
const advanceTemplate = require("../templates/advanceTemplate");

exports.routes = [route(isAskAdvanced, showAdvanced)];

function isAskAdvanced(context) {
  if (!context.event.isText) return false;
  let types = advanceConfig.map(config => config.title);
  let { text } = context.event.message;
  let regex = new RegExp(`^(?<type>(${types.join("|")}))技能書$`);
  let match = text.match(regex);

  if (!match) return false;

  context.advanced = { type: match.groups.type };
  return true;
}

async function showAdvanced(context) {
  const { type } = context.advanced;
  let target = advanceConfig.find(config => config.title === type);
  let bubbles = [];

  let secondBooks = await itemService.getAllById(
    target.id.second,
    {},
    { orderBy: "name", order: "desc" }
  );
  let secondNames = classifyBooks(secondBooks.map(book => book.name));
  bubbles.push(
    advanceTemplate.genAdvancedBubble(
      `二階技能書 - ${type}`,
      secondNames.map(advanceTemplate.genSkillBox)
    )
  );

  let thirdBooks = await itemService.getAllById(
    target.id.third,
    {},
    { orderBy: "name", order: "desc" }
  );
  let thirdNames = classifyBooks(thirdBooks.map(book => book.name));
  bubbles.push(
    advanceTemplate.genAdvancedBubble(
      `三階技能書 - ${type}`,
      thirdNames.map(advanceTemplate.genSkillBox)
    )
  );

  context.sendFlex(`${type}技能書資訊`, { type: "carousel", contents: bubbles });
}

/**
 * 整理書
 * @param {Array<String>} names
 */
function classifyBooks(names) {
  let result = names.map(name => name.replace(/\d{1,2}級/, ""));
  return [...new Set(result)];
}
