const i18n = require("../../utils/i18n");
const { Context } = require("bottender");
const { text, route } = require("bottender/router");
const itemService = require("../services/itemService");
const itemTemplate = require("../templates/item/itemTemplate");
const driverSerivce = require("../services/driverService");
const backService = require("../services/backService");
const mediaList = ["背飾", "座騎"];
const skipKeys = ["id", "name", "note", "type", "picture", "summary", "src"];
const weighted = require("../../configs/weighted.config");
const alias = [
  { origin: /^\.?(外功?[坐座]騎)$/, to: ".driverrank 外*11 物 技*3 命", type: "座騎" },
  { origin: /^\.?(玄學?[坐座]騎)$/, to: ".driverrank 玄*7 技*3 命", type: "座騎" },
  { origin: /^\.?(內力?[坐座]騎)$/, to: ".driverrank 內*7 技*3 命", type: "座騎" },
  { origin: /^\.?(身法?[坐座]騎)$/, to: ".driverrank 身*7 重擊*5 閃躲*3", type: "座騎" },
  { origin: /^\.?(外玄[坐座]騎)$/, to: ".driverrank 外*10 玄*7 物 技*3 命", type: "座騎" },
  { origin: /^\.?(玄內[坐座]騎)$/, to: ".driverrank 玄*7 內*7 技*3 命", type: "座騎" },
  { origin: /^\.?(外功?背[部飾])$/, to: ".backrank 外*11 物 技*3 命", type: "背飾" },
  { origin: /^\.?(玄學?背[部飾])$/, to: ".backrank 玄*7 技*3 命", type: "背飾" },
  { origin: /^\.?(內力?背[部飾])$/, to: ".backrank 內*7 技*3 命", type: "背飾" },
  { origin: /^\.?(身法?背[部飾])$/, to: ".backrank 身*7 重擊*5 閃躲*3", type: "背飾" },
  { origin: /^\.?(外玄背[部飾])$/, to: ".backrank 外*10 玄*7 物 技*3 命", type: "背飾" },
  { origin: /^\.?(玄內背[部飾])$/, to: ".backrank 玄*7 內*7 技*3 命", type: "背飾" },
];

// 一定要 `exports` 此變數
exports.routes = [
  route(isFilter, showFilter),
  route(isAlias, (context, props) => showRanking(context, { type: context.rankType, ...props })),
  text(/^\.?(item|物品)\s(?<item>\d+)$/, searchItemId),
  text(/^\.?(item|物品)\s/, searchItem),
  text(/^\.?(equip|裝備)\s/, (context, props) =>
    searchItem(context, { ...props, type: ["座騎", "背飾", "左飾", "中飾", "右飾", "帽"] })
  ),
  text(/^\.?(driver|[座坐]騎?)\s/, (context, props) =>
    searchItem(context, { ...props, type: "座騎" })
  ),
  text(/^\.?(back|背[部飾]?)\s/, (context, props) =>
    searchItem(context, { ...props, type: "背飾" })
  ),
  text(/^\.?(mid|中飾?)\s/, (context, props) => searchItem(context, { ...props, type: "中飾" })),
  text(/^\.?(left|左飾?)\s/, (context, props) => searchItem(context, { ...props, type: "左飾" })),
  text(/^\.?(right|右飾?)\s/, (context, props) => searchItem(context, { ...props, type: "右飾" })),
  text(/^\.?(compare|裝備比較)\s(?<equipA>\S+)\s(?<equipB>\S+)$/, equipCompare),
  text(/^\.?(drivercompare|[坐座]騎比較)\s(?<equipA>\S+)\s(?<equipB>\S+)$/, (context, props) =>
    equipCompare(context, { ...props, type: "座騎" })
  ),
  text(/^\.?(backcompare|背[部飾]比較)\s(?<equipA>\S+)\s(?<equipB>\S+)$/, (context, props) =>
    equipCompare(context, { ...props, type: "背飾" })
  ),
  text(/^\.?(backrank|背[部飾]排行)\s/, (context, props) =>
    showRanking(context, { ...props, type: "背飾" })
  ),
  text(/^\.?(driverrank|[坐座]騎排行)\s/, (context, props) =>
    showRanking(context, { ...props, type: "座騎" })
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
  const params = context.event.message.text.split(/\s+/g);
  params.shift();
  context.sendText(`您要查的是 ${params.join("+")}`);
  const items = await itemService.getByName(params, { type: props.type });

  if (items.length === 0) {
    return context.sendText("查無相對應的物品，建議只搜尋確認的字\n例如：物品 極 重擊 赤");
  }

  if (items.length === 1) {
    let [target] = items;
    return mediaList.includes(target.type) ? showMedia(context, target) : showItem(context, target);
  }

  let findResult = items.find(item => item.name === params[0]);
  if (findResult) {
    return mediaList.includes(findResult.type)
      ? showMedia(context, findResult)
      : showItem(context, findResult);
  }

  return showSearchResult(context, items);
}

function showSearchResult(context, items) {
  let classifyItem = classify(items);
  let bubbles = [];
  Object.keys(classifyItem).forEach(key => {
    let rows = classifyItem[key].map(item => itemTemplate.genSearchRow(item));
    for (let i = 0; i < rows.length; i += 9) {
      bubbles.push(itemTemplate.genSearchBubble(key, rows.slice(i, i + 9)));
    }
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

  return context.sendText(response.join("\n").replace(/\\n+/g, "\n"));
}

/**
 * 裝備有圖片的話，進行`flex`顯示
 * @param {Context} context
 * @param {Object} target
 */
async function showMedia(context, target) {
  let src = await getSheetPicture(target);

  if (!src) {
    return showItem(context, target);
  }

  let bubbles = [itemTemplate.genImageBubble(target.name, src)];

  let rows = Object.keys(target)
    .filter(key => target[key] && !skipKeys.includes(key))
    .map(key => itemTemplate.genAttributeRow(i18n.__("item." + key), target[key]));

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
    { re: /^\.?(driver|[座坐]騎?)$/, type: "座騎" },
    { re: /^\.?(back|背[部飾]?)$/, type: "背飾" },
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

/**
 * 裝備比較
 * @param {Context} context
 * @param {import("bottender").Props} props
 */
async function equipCompare(context, props) {
  const { equipA, equipB } = props.match.groups;
  const { type } = props;

  let a = await itemService.getByName([equipA], { type });
  let b = await itemService.getByName([equipB], { type });

  if (a.length === 0) {
    return context.sendText(`錯誤： \`${equipA}\` 查無結果`);
  }
  if (b.length === 0) {
    return context.sendText(`錯誤： \`${equipB}\` 查無結果`);
  }

  if (a.length > 1) {
    context.sendText(`錯誤： \`${equipA}\` 查到${a.length}個結果`);
  }
  if (b.length > 1) {
    context.sendText(`錯誤： \`${equipB}\` 查到${b.length}個結果`);
  }

  if (a.length > 1 || b.length > 1) return;

  [a] = a;
  [b] = b;

  if (!type && a.type !== b.type) {
    return context.sendText(
      `無法比較兩種不同類型的裝備\n${equipA} 為 **${a.type}**\n${equipB} 為 **${b.type}**`
    );
  }

  let equips = [a, b];
  let diff = equipDiff(a, b);
  diff[0].src = await getSheetPicture(diff[0]);
  diff[1].src = await getSheetPicture(diff[1]);

  let bubbles = [];

  diff.forEach((equip, index) => {
    if (!equip.src) return;

    // 插入圖片bubble
    bubbles.push(itemTemplate.genImageBubble(equip.name, equip.src));

    // 插入比較表
    bubbles.push(
      itemTemplate.genCompareBubble(
        equip.name,
        Object.keys(equip)
          .filter(key => !skipKeys.includes(key))
          .map(key =>
            itemTemplate.genCompareRow(i18n.__("item." + key), equips[index][key], equip[key])
          )
      )
    );

    // 插入是否更換表
    bubbles.push(
      itemTemplate.genWeightedBubble(
        equips[index].name,
        equips[(index + 1) % 2].name,
        weighted.map(data =>
          itemTemplate.genWeightedRow(data.type, weightedCaculate(equip, data.params))
        )
      )
    );
  });

  context.sendFlex("比較結果", { type: "carousel", contents: bubbles });
}

/**
 * 比較裝備差異
 * @param {Object} a
 * @param {Object} b
 */
function equipDiff(a, b) {
  let skipKeys = ["id", "name", "note", "type", "summary", "level", "weight", "picture"];
  let aAttributes = Object.keys(a);
  let bAttributes = Object.keys(b);

  let totalAttributes = [
    ...new Set([
      ...aAttributes.filter(key => a[key] && !skipKeys.includes(key)),
      ...bAttributes.filter(key => b[key] && !skipKeys.includes(key)),
    ]),
  ].sort((a, b) => aAttributes.indexOf(a) - aAttributes.indexOf(b)); // 按照原本屬性進行排序處理

  let result = [
    { equip: a, compare: b },
    { equip: b, compare: a },
  ].map(data => {
    let { equip, compare } = data;

    let temp = { name: equip.name, type: equip.type };
    totalAttributes.forEach(attr => {
      temp[attr] = equip[attr] - compare[attr];
    });

    return temp;
  });

  return result;
}

/**
 * 裝備差異加權計算
 * @param {Object}  equip 裝備
 * @param {Array<{key: String, value: number}>} 參數
 */
function weightedCaculate(equip, params) {
  let weight = params
    .map(param => (equip[param.key] || 0) * param.value)
    .reduce((pre, curr) => pre + curr);

  return Math.round(weight);
}

async function getSheetPicture(target) {
  let data = await getSheetEquipData(target);
  if (!data) return null;
  return data["新版圖片"] || data["圖片網址"] || null;
}

/**
 * 顯示加權排行榜
 * @param {Context} context
 * @param {import("bottender").Props} props
 */
async function showRanking(context, props) {
  let { type } = props;
  let attrs = context.event.message.text.split(/\s+/g);
  attrs.shift();
  let columns = await itemService.getColumns();
  columns = columns.map(col => ({
    key: col,
    note: i18n.__("item." + col),
  }));

  let attrDetail = [];
  attrs.forEach(attr => {
    // 不符合 XX*YY 的格式 即略過
    if (/^\S{1,2}(\*\d{1,2})?$/.test(attr) === false) return;
    let name = attr.replace(/[\d\*]+/, "");
    let value = attr.replace(/\D+/, "") || "1";
    let col = columns.find(col => col.note.indexOf(name) !== -1);
    if (!col) return;

    attrDetail.push({
      key: col.key,
      name: col.note,
      value: parseInt(value),
    });
  });

  if (attrDetail.length === 0) {
    return context.sendText(
      "無合法的屬性參數，以下為可以用的屬性\n" + columns.map(col => col.note).join("、")
    );
  }

  let equips = await itemService.filterByAttributes({ type, level: 80 });
  equips = equips
    .map(equip => ({ ...equip, weighted: weightedCaculate(equip, attrDetail) }))
    .filter(equip => equip.weighted !== 0)
    .sort((a, b) => b.weighted - a.weighted);

  let bubbles = [];
  let rows = equips.slice(0, 30).map((equip, index) => itemTemplate.genRankRow(index + 1, equip));

  for (let i = 0; i < rows.length; i += 10) {
    bubbles.push(itemTemplate.genRankBubble(rows.slice(i, i + 10)));
  }

  context.sendFlex("排行計算", { type: "carousel", contents: bubbles });
  context.sendText(`公式參考：${attrDetail.map(attr => `${attr.name}*${attr.value}`).join("+")}`);
}

/**
 * 看看是否為別名指令
 * @param {Context} context
 */
function isAlias(context) {
  if (!context.event.isText) return false;
  const { text } = context.event.message;
  let target = alias.find(alia => alia.origin.test(text));
  if (!target) return false;

  context.event.message.text = target.to;
  context.rankType = target.type;
  return true;
}
