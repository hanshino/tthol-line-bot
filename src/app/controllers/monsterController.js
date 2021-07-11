const { Context } = require("bottender");
const { text } = require("bottender/router");
const monsterService = require("../services/monsterService");
const monsterTemplate = require("../templates/monsterTemplate");
const i18n = require("../../utils/i18n");

exports.routes = [
  text(/^.?(monster|怪物?)\s(?<min_level>\d{1,3})~(?<max_level>\d{1,3})$/, levelSearch),
  text(/^.?(monster|怪物?)\s(?<monster>\d+)$/, searchMonsterId),
  text(/^.?(monster|怪物?)\s(?<monster>\S+)$/, searchMonster),
  text(/^.?(?<elemental>[火水電木])屬怪物?(\s(?<level>\d+)等?)?$/, elementalSearch),
];

async function levelSearch(context, props) {
  const { min_level, max_level } = props.match.groups;

  let monsters = await monsterService.search({
    attributes: [
      { key: "level", operation: ">=", value: min_level },
      { key: "level", operation: "<=", value: max_level },
    ],
  });

  return showMultiResult(context, monsters);
}

async function elementalSearch(context, props) {
  const { elemental, level = 1 } = props.match.groups;

  let monsters = await monsterService.search({
    attributes: [
      { key: "elemental", value: elemental },
      { key: "level", value: level },
    ],
  });

  return showMultiResult(context, monsters);
}

/**
 * 怪物篩選
 * @param {Context} context
 */
function monsterFilter(context) {
  console.log(context.monsterFilter);
}

async function searchMonsterId(context, props) {
  const { monster: id } = props.match.groups;
  const target = await monsterService.find(id);

  return showResult(context, target);
}

function showResult(context, target) {
  let classify = [
    {
      title: "基本屬性",
      keys: [
        "name",
        "level",
        "hp",
        "elemental",
        "elemental_attack",
        "base_hit",
        "base_dodge",
        "drop_exp",
        "drop_money_max",
      ],
    },
    // { title: "六圍屬性", keys: ["str", "pow", "vit", "dex", "agi", "wis"] },
    {
      title: "傷害參數",
      keys: [
        "damage_min",
        "damage_max",
        "pDamage_min",
        "pDamage_max",
        "attack_speed",
        "attack_range",
      ],
    },
    {
      title: "防禦參數",
      keys: ["extra_def", "magic_def", "fire_def", "water_def", "lightning_def", "wood_def"],
    },
  ];

  let bubbles = classify.map(data =>
    monsterTemplate.genAttributeBubble(
      data.title,
      data.keys.map(key => monsterTemplate.genAttributeRow(i18n.__("monster." + key), target[key]))
    )
  );

  context.sendFlex(target.name, { type: "carousel", contents: bubbles });
}

/**
 * 查找怪物
 * @param {Context} context
 * @param {import("bottender").Props} props
 */
async function searchMonster(context, props) {
  const { monster } = props.match.groups;
  const monsters = await monsterService.searchByName(monster, false);

  if (monsters.length === 0) {
    return context.sendText("查無相對應的結果");
  }

  if (monsters.length === 1) {
    return context.sendText(`您要查詢的是${monsters[0].name}`);
  }

  return showMultiResult(context, monsters);
}

/**
 * 傳送查詢結果
 * @param {Context} context
 * @param {Array} monsters
 */
async function showMultiResult(context, monsters) {
  let rows = monsters.map(data => monsterTemplate.genMonsterRow(data));
  let bubbles = [];
  for (let i = 0; i < rows.length; i += 10) {
    bubbles.push(monsterTemplate.genMonsterBubble(rows.slice(i, i + 10)));
  }

  context.sendFlex("查詢結果", {
    type: "carousel",
    contents: bubbles.slice(0, 12),
  });

  if (bubbles.length > 12) {
    context.sendText("還有剩餘結果未顯示，如未在上列，請縮小搜尋範圍");
  }
}

async function isFilter(context) {
  if (!context.event.isText) return false;
  const { text } = context.event.message;
  let attrs = text.split(/\s+/g);

  if (/^.?(monster|怪物?)/.test(text) === false) return false;

  let columns = await monsterService.getColumnNames();
  columns = columns.map(col => ({
    key: col,
    note: i18n.__("monster." + col),
  }));

  let attrDetail = [];
  attrs.forEach(attr => {
    let name = attr.replace(/\d+/, "");
    let value = attr.replace(/\D+/, "") || "1";
    let col = columns.find(col => col.note.indexOf(name) !== -1);
    if (!col) return;

    attrDetail.push({
      key: col.key,
      name: col.note,
      value: parseInt(value),
    });
  });

  if (attrDetail.length === 0) return false;

  context.monsterFilter = {
    attributes: attrDetail,
  };

  return true;
}
