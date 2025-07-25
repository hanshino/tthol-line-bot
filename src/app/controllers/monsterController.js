const { text } = require("bottender/router");
const monsterService = require("../services/monsterService");
const itemService = require("../services/itemService");
const monsterTemplate = require("../templates/monsterTemplate");
const i18n = require("../../utils/i18n");

exports.routes = [
  text(/^\.?(monster|怪物?)\s(?<min_level>\d{1,3})[~-](?<max_level>\d{1,3})$/, levelSearch),
  text(/^\.?(monster|怪物?)\s(?<monster>\d+)$/, searchMonsterId),
  text(/^\.?(monster|怪物?)\s(?<monster>\S+)$/, searchMonster),
  text(/^\.?(?<elemental>[火水電木])屬怪物?(\s(?<level>\d+)等?)?$/, elementalSearch),
];

async function levelSearch(context, props) {
  const { min_level, max_level } = props.match.groups;

  let monsters = await monsterService.search(
    {
      attributes: [
        { key: "level", operation: ">=", value: min_level },
        { key: "level", operation: "<=", value: max_level },
      ],
    },
    { orderBy: "level", order: "asc" }
  );

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

async function searchMonsterId(context, props) {
  const { monster: id } = props.match.groups;
  const target = await monsterService.find(id);

  if (!target) {
    return context.replyText(i18n.__("monster.id_not_found"));
  }

  return showResult(context, target);
}

async function showResult(context, target) {
  const { id } = target;
  const monster = await monsterService.findMonster(id);

  // 處理掉落物品
  let dropItems = "";
  if (monster && monster.drop_item) {
    try {
      const dropItemIds = JSON.parse(monster.drop_item);
      if (Array.isArray(dropItemIds) && dropItemIds.length > 0) {
        const items = await itemService.getAllById(dropItemIds);
        dropItems = items
          .map(item => item.name)
          .filter(name => name)
          .join("、");
      }
    } catch (error) {
      console.error("解析 drop_item JSON 失敗:", error);
    }
  }

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

  context.replyFlex(target.name, { type: "carousel", contents: bubbles });

  // 如果有掉落物品，單獨回覆文字訊息
  if (dropItems) {
    context.replyText(`掉落物品：${dropItems}`);
  }
}

/**
 * 查找怪物
 * @param {import("bottender").LineContext} context
 * @param {import("bottender").Props} props
 */
async function searchMonster(context, props) {
  const { monster } = props.match.groups;
  const monsters = await monsterService.searchByName(monster, false);

  if (monsters.length === 0) {
    return context.replyText("查無相對應的結果");
  }

  if (monsters.length === 1) {
    return showResult(context, monsters[0]);
  }

  return showMultiResult(context, monsters);
}

/**
 * 傳送查詢結果
 * @param {import("bottender").LineContext} context
 * @param {Array} monsters
 */
async function showMultiResult(context, monsters) {
  let rows = monsters.map(data => monsterTemplate.genMonsterRow(data));
  let bubbles = [];
  for (let i = 0; i < rows.length; i += 10) {
    bubbles.push(monsterTemplate.genMonsterBubble(rows.slice(i, i + 10)));
  }

  context.replyFlex("查詢結果", {
    type: "carousel",
    contents: bubbles.slice(0, 12),
  });

  if (bubbles.length > 12) {
    context.replyText("還有剩餘結果未顯示，如未在上列，請縮小搜尋範圍");
  }
}
