const item = require("../models/item");
const itemImage = require("../models/itemImage");
const memory = require("memory-cache");

// 中文類型 → 新 schema 過濾條件。
// 座騎/背飾/帽/衣 用 type_name（同一 type_name 涵蓋一般與外裝欄位）；
// 左/中/右飾 的 type_name 都是 ORNAMENT，只能靠 equip_slot 區分。
const TYPE_FILTER = {
  座騎: { column: "type_name", value: "HORSE" },
  背飾: { column: "type_name", value: "WING" },
  帽: { column: "type_name", value: "HELMET" },
  衣: { column: "type_name", value: "ARMOR" },
  左飾: { column: "equip_slot", value: "ORNAMENT_1" },
  中飾: { column: "equip_slot", value: "ORNAMENT_2" },
  右飾: { column: "equip_slot", value: "ORNAMENT_3" },
};

// 反向對照：由資料列推回中文類型，讓 controller 沿用 item.type（分類、媒體判斷、比較）。
const TYPE_NAME_ZH = { HORSE: "座騎", WING: "背飾", HELMET: "帽", ARMOR: "衣" };
const EQUIP_SLOT_ZH = { ORNAMENT_1: "左飾", ORNAMENT_2: "中飾", ORNAMENT_3: "右飾" };

// ponytail: 飾品三格只有 equip_slot 分得出，故先查 slot 再查 type_name。
// 其餘類型（武器、藥水…）暫時回傳英文 type_name；要中文分類名再補對照表即可。
function resolveType(row) {
  return EQUIP_SLOT_ZH[row.equip_slot] || TYPE_NAME_ZH[row.type_name] || row.type_name || null;
}

function decorate(rows) {
  return rows.map(row => ({ ...row, type: resolveType(row) }));
}

// 把中文類型（字串或陣列）套成 where 條件，跨 type_name / equip_slot 做 OR。
function applyTypeFilter(query, type) {
  const types = Array.isArray(type) ? type : [type];
  const specs = types.map(t => TYPE_FILTER[t]).filter(Boolean);
  if (specs.length === 0) return;
  query.where(function () {
    specs.forEach(spec => this.orWhere(spec.column, spec.value));
  });
}

/**
 * 透過id查詢物品
 * @param {number} id
 * @returns {Promise<Array>}
 */
exports.find = async id => {
  return decorate(await item().select("*").where("id", "=", id));
};

/**
 * 透過名稱搜尋物品
 * @param {array<String} names 物品名稱
 * @param {array} filter  可過濾部分資料
 * - type
 * - note
 * @returns {Promise<Array>}
 */
exports.findByName = async (names, filter = {}) => {
  let query = item().select("*");

  names.forEach(name => {
    query.where("name", "like", `%${name}%`);
  });

  if (filter.type) {
    applyTypeFilter(query, filter.type);
  }

  return decorate(await query);
};

/**
 * 透過屬性篩選出結果
 * @param {Array} filter
 */
exports.filterByAttributes = async filter => {
  let query = item().select("*");

  if (filter.attributes) {
    filter.attributes.forEach(attr => {
      query.where(attr.key, ">=", attr.value);
    });
  }

  // 類型篩選
  if (filter.type) {
    applyTypeFilter(query, filter.type);
  }

  // 等級篩選
  if (filter.level) {
    query.where("base_lv", ">=", filter.level);
  }

  return decorate(await query);
};

/**
 * 取得此表可用於篩選/排行的屬性欄位
 * @returns {Promise<Array>}
 */
exports.getColumns = async () => {
  let cols = memory.get("ITEM_COLUMNS");
  if (cols) return cols;

  cols = await item()
    .columns([
      "base_lv",
      "hp",
      "mp",
      "str",
      "pow",
      "vit",
      "dex",
      "agi",
      "wis",
      "atk",
      "matk",
      "extra_def",
      "magic_def",
      "dodge",
      "uncanny_dodge",
      "critical_hit",
      "hit",
      "walk_speed",
    ])
    .limit(1)
    .then(res => Object.keys(res[0]));

  memory.put("ITEM_COLUMNS", cols);
  return cols;
};

/**
 * 取得指定的所有`id`物品
 * @param {Array} ids
 * @param {Object} filter
 * @param {Object} sort
 * @return {Promise<Array>}
 */
exports.getAllById = async (ids, filter = {}, sort = {}) => {
  let query = item().select("*").whereIn("id", ids);

  if (sort.orderBy) {
    query.orderBy(sort.orderBy, sort.order || "desc");
  }

  return decorate(await query);
};

/**
 * 取得物品的小圖示（icon 優先，沒有則退回 gicon）
 * @param {number} id
 * @returns {Promise<string|null>}
 */
exports.getIconUrl = async id => {
  const rows = await itemImage().select("kind", "url").where("item_id", "=", id);
  const icon = rows.find(r => r.kind === "icon") || rows.find(r => r.kind === "gicon");
  return icon ? icon.url : null;
};
