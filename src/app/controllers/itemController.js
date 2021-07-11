const i18n = require("../../utils/i18n");
const { Context } = require("bottender");
const { text, route } = require("bottender/router");
const itemService = require("../services/itemService");
const itemTemplate = require("../templates/item/itemTemplate");
const driverSerivce = require("../services/driverService");
const backService = require("../services/backService");
const mediaList = ["背飾", "座騎"];
const skipKeys = ["id", "name", "note", "type", "picture", "summary"];

// 一定要 `exports` 此變數
exports.routes = [
  route(isFilter, showFilter),
  text(/^.?(item|物品?)\s(?<item>\d+)$/, searchItemId),
  text(/^.?(item|物品?)\s(?<item>\S+)$/, searchItem),
  text(/^.?(driver|[座坐]騎?)\s(?<item>\S+)$/, (context, props) =>
    searchItem(context, { ...props, type: "座騎" })
  ),
  text(/^.?(back|背[部飾]?)\s(?<item>\S+)$/, (context, props) =>
    searchItem(context, { ...props, type: "背飾" })
  ),
];

async function searchItemId(context, props) {
  const { item } = props.match.groups;

  context.sendText(`id搜尋，id: ${item}`);
  let result = await itemService.getById(item);

  if (result.length === 0) {
    return context.sendText("查無此id");
  }

  let [target] = result;
  if (mediaList.includes(target.type)) {
    return showMedia(context, target);
  }

  return showItem(context, target);
}

/**
 * 物品查詢
 *
 * @param {Context} context
 * @param {import("bottender").Props} props
 */
async function searchItem(context, props) {
  context.sendText(`您要查的是 ${props.match.groups.item}`);

  const { item } = props.match.groups;
  const items = await itemService.getByName(item, { type: props.type });

  if (items.length === 0) {
    return context.sendText("查無相對應的物品，建議只搜尋確認的字\n例如：❎迷霧縹緲 ✅霧");
  }

  if (items.length === 1) {
    let [target] = items;
    return mediaList.includes(target.type) ? showMedia(context, target) : showItem(context, target);
  }

  return showSearchResult(context, items);
}

function showSearchResult(context, items) {
  let classifyItem = classify(items);
  let bubbles = Object.keys(classifyItem).map(key => {
    let rows = classifyItem[key].slice(0, 15).map(item => itemTemplate.genSearchRow(item));

    return itemTemplate.genSearchBubble(key, rows);
  });

  for (let i = 0; i < bubbles.length; i += 10) {
    context.sendFlex("物品查詢結果", {
      type: "carousel",
      contents: bubbles.slice(i, i + 10),
    });
  }
}

/**
 * 整理`item`使其根據物品類型分類
 * @param {Array} items
 * @return {Object}
 */
function classify(items) {
  let result = {};

  items.forEach(item => {
    result[item.type] = result[item.type] || [];
    result[item.type].push(item);
  });

  return result;
}

/**
 * 一般物品的顯示
 * @param {Context} context
 * @param {Object} item
 */
function showItem(context, item) {
  let response = Object.keys(item)
    .filter(key => item[key])
    .map(key => {
      return `${i18n.__(`item.${key}`)}：${item[key]}`;
    });

  return context.sendText(response.join("\n"));
}

/**
 * 裝備有圖片的話，進行`flex`顯示
 * @param {Context} context
 * @param {Object} target
 */
async function showMedia(context, target) {
  let data = await getSheetEquipData(target);
  let src = data["新版圖片"] || data["圖片網址"];

  if (!src) {
    return showItem(context, target);
  }

  let bubbles = [itemTemplate.genImageBubble(src)];

  let rows = Object.keys(target)
    .filter(key => target[key] && !skipKeys.includes(key))
    .map(key => itemTemplate.genAttributeRow(i18n.__(`item.${key}`), target[key]));

  bubbles.push(itemTemplate.genAttributeBubble(rows));
  context.sendFlex(target.name, { type: "carousel", contents: bubbles });
}

async function getSheetEquipData(target) {
  switch (target.type) {
    case "座騎":
      return driverSerivce.getByName(target.name);
    case "背飾":
      return backService.getByName(target.name);
    default:
      return {};
  }
}

async function showFilter(context) {
  let items = await itemService.filterByAttributes(context.itemFilter);
  return showSearchResult(context, items);
}

async function isFilter(context) {
  if (!context.event.isText) return false;
  const { text } = context.event.message;
  let attrs = text.split(/\s+/g);
  let type = attrs.shift();

  let filterArr = [
    { re: /^.?(driver|[座坐]騎?)$/, type: "座騎" },
    { re: /^.?(back|背[部飾]?)$/, type: "背飾" },
  ];

  let filterType = filterArr.find(data => data.re.test(type));
  if (!filterType) return false;

  let columns = await itemService.getColumns();
  columns = columns.map(col => ({
    key: col,
    note: i18n.__("item." + col),
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

  context.itemFilter = {
    type: filterType.type,
    attributes: attrDetail,
  };

  return true;
}
