const COLORS = {
  primary: "#b6322d",
  background: "#f9f6f1",
  card: "#fcfaf6",
  ink: "#171b22",
  muted: "#585e68",
  border: "#dbd7cf",
  celadon: "#54967a",
  indigo: "#2c6194",
  plum: "#744c7d",
};

function statColor(key) {
  if (
    [
      "atk",
      "matk",
      "damage_min",
      "damage_max",
      "pdamage_min",
      "pdamage_max",
      "critical_hit",
    ].includes(key)
  )
    return COLORS.primary;
  if (["walk_speed", "run_speed", "attack_speed", "agi"].includes(key)) return COLORS.celadon;
  if (["mp", "wis", "hit", "dodge"].includes(key)) return COLORS.indigo;
  if (["magic_def", "pow", "uncanny_dodge"].includes(key)) return COLORS.plum;
  return COLORS.ink;
}

// 每個 meta 欄位長度不一（例如「售價 9800」比「#50」長很多），若全部塞進同一個
// horizontal box，沒指定 flex 的 text 預設 flex:1 會被平均切版、長字串直接被截斷成「...」。
// 這裡改成 flex:0（依內容自身寬度顯示，不被平分), 並依內容數量切成多列 horizontal box，
// 避免單列塞太多欄位而爆版。
const META_ROW_CHUNK_SIZE = 3;

function metaContents(item) {
  const parts = [
    `#${item.id}`,
    item.base_lv && `等級 ${item.base_lv}`,
    item.weight && `重量 ${item.weight}`,
    item.value > 0 && `售價 ${item.value}`,
    item.durability > 0 && `耐久 ${item.durability}`,
  ].filter(Boolean);

  const rows = [];
  for (let i = 0; i < parts.length; i += META_ROW_CHUNK_SIZE) {
    rows.push(parts.slice(i, i + META_ROW_CHUNK_SIZE));
  }

  return rows.map(row => ({
    type: "box",
    layout: "horizontal",
    spacing: "lg",
    contents: row.map(text => ({
      type: "text",
      text,
      color: COLORS.card,
      size: "xs",
      flex: 0,
    })),
  }));
}

function typeBadge(type) {
  return {
    type: "box",
    layout: "vertical",
    backgroundColor: COLORS.card,
    cornerRadius: "20px",
    paddingTop: "3px",
    paddingBottom: "3px",
    paddingStart: "10px",
    paddingEnd: "10px",
    contents: [
      {
        type: "text",
        text: `${type || ""}`,
        color: COLORS.primary,
        size: "xs",
        weight: "bold",
        align: "center",
      },
    ],
  };
}

function iconTile(url, size) {
  return {
    type: "box",
    layout: "vertical",
    backgroundColor: COLORS.background,
    cornerRadius: "8px",
    width: size,
    height: size,
    justifyContent: "center",
    alignItems: "center",
    paddingAll: "2px",
    contents: [{ type: "image", url, size: "full", aspectMode: "fit", aspectRatio: "1:1" }],
  };
}

function sectionTitle(padded = true) {
  return {
    type: "box",
    layout: "horizontal",
    ...(padded
      ? { paddingStart: "16px", paddingEnd: "16px", paddingTop: "6px" }
      : { paddingTop: "4px" }),
    paddingBottom: "8px",
    alignItems: "center",
    contents: [
      {
        type: "box",
        layout: "vertical",
        width: "3px",
        height: "14px",
        backgroundColor: COLORS.primary,
        cornerRadius: "2px",
        contents: [],
      },
      { type: "text", text: "屬性", color: COLORS.ink, size: "sm", weight: "bold", margin: "md" },
    ],
  };
}

function flavor(item) {
  return `${item.note || item.summary || ""}`.replace(/\\n+/g, "\n");
}

exports.statColor = statColor;

exports.genStatRow = (label, value, color) => ({
  type: "box",
  layout: "horizontal",
  paddingTop: "8px",
  paddingBottom: "8px",
  paddingStart: "12px",
  paddingEnd: "12px",
  contents: [
    { type: "text", text: `${label}`, color: COLORS.muted, size: "xs", flex: 3 },
    {
      type: "text",
      text: `${value}`,
      color: color || COLORS.ink,
      size: "sm",
      weight: "bold",
      align: "end",
      flex: 2,
    },
  ],
});

exports.genHeroIdentityBubble = (item, heroImageUrl, iconUrl) => {
  const identity = [
    iconUrl && iconTile(iconUrl, "36px"),
    {
      type: "text",
      text: `${item.name || ""}`,
      color: COLORS.card,
      size: "xl",
      weight: "bold",
      flex: 1,
      wrap: true,
    },
    typeBadge(item.type),
  ].filter(Boolean);
  return {
    type: "bubble",
    size: "mega",
    hero: {
      type: "image",
      url: heroImageUrl,
      size: "full",
      aspectRatio: "4:3",
      aspectMode: "cover",
    },
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: COLORS.primary,
      paddingAll: "0px",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          paddingTop: "12px",
          paddingBottom: "10px",
          paddingStart: "16px",
          paddingEnd: "16px",
          alignItems: "center",
          spacing: "md",
          contents: identity,
        },
        {
          type: "box",
          layout: "vertical",
          paddingTop: "0px",
          paddingBottom: "14px",
          paddingStart: "16px",
          paddingEnd: "16px",
          spacing: "xs",
          contents: metaContents(item),
        },
      ],
    },
  };
};

exports.genStatsBubble = (item, rows) => ({
  type: "bubble",
  size: "mega",
  body: {
    type: "box",
    layout: "vertical",
    backgroundColor: COLORS.card,
    paddingAll: "0px",
    contents: [
      {
        type: "box",
        layout: "vertical",
        backgroundColor: COLORS.primary,
        paddingTop: "14px",
        paddingBottom: "14px",
        paddingStart: "16px",
        paddingEnd: "16px",
        contents: [
          {
            type: "text",
            text: `${item.name || ""}`,
            color: COLORS.card,
            size: "sm",
            weight: "bold",
          },
        ],
      },
      {
        type: "box",
        layout: "vertical",
        paddingStart: "16px",
        paddingEnd: "16px",
        paddingTop: "14px",
        paddingBottom: "10px",
        contents: [
          {
            type: "text",
            text: flavor(item),
            color: COLORS.muted,
            size: "xs",
            wrap: true,
            lineSpacing: "6px",
          },
        ],
      },
      sectionTitle(),
      {
        type: "box",
        layout: "vertical",
        paddingStart: "16px",
        paddingEnd: "16px",
        paddingBottom: "16px",
        spacing: "none",
        contents: rows.map((row, idx) => ({
          type: "box",
          layout: "vertical",
          backgroundColor: idx % 2 === 0 ? COLORS.background : COLORS.card,
          paddingAll: "0px",
          contents: [row],
        })),
      },
    ],
  },
});

exports.genIconHeaderBubble = (item, iconUrl, rows) => {
  const header = [
    iconUrl && iconTile(iconUrl, "44px"),
    {
      type: "box",
      layout: "vertical",
      flex: 1,
      spacing: "sm",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          alignItems: "center",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: `${item.name || ""}`,
              color: COLORS.card,
              size: "lg",
              weight: "bold",
              flex: 1,
              wrap: true,
            },
            typeBadge(item.type),
          ],
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "xs",
          contents: metaContents(item),
        },
      ],
    },
  ].filter(Boolean);
  const columns = [[], []];
  rows.forEach((row, idx) => columns[idx % 2].push(row));
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: COLORS.card,
      paddingAll: "0px",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          backgroundColor: COLORS.primary,
          paddingTop: "14px",
          paddingBottom: "12px",
          paddingStart: "16px",
          paddingEnd: "16px",
          spacing: "md",
          alignItems: "center",
          contents: header,
        },
        {
          type: "box",
          layout: "vertical",
          paddingStart: "16px",
          paddingEnd: "16px",
          paddingTop: "12px",
          paddingBottom: "8px",
          contents: [
            {
              type: "text",
              text: flavor(item),
              color: COLORS.muted,
              size: "xs",
              wrap: true,
              lineSpacing: "6px",
            },
          ],
        },
        ...(rows.length > 0
          ? [
              {
                type: "box",
                layout: "vertical",
                paddingStart: "16px",
                paddingEnd: "16px",
                paddingTop: "4px",
                paddingBottom: "16px",
                contents: [
                  sectionTitle(false),
                  {
                    type: "box",
                    layout: "horizontal",
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.border,
                    borderWidth: "1px",
                    cornerRadius: "8px",
                    paddingAll: "12px",
                    spacing: "none",
                    contents: columns.map(column => ({
                      type: "box",
                      layout: "vertical",
                      flex: 1,
                      spacing: "sm",
                      contents: column,
                    })),
                  },
                ],
              },
            ]
          : []),
      ],
    },
  };
};

/**
 * 取物品顯示的橫欄（含小圖示）
 * @param {Object} data item 物件
 * @param {string|null} iconUrl 圖示 URL（可為 null）
 */
exports.genSearchRow = (data, iconUrl) => {
  let { name, summary, id } = data;
  const summaryText = summary ? summary.replace(/\\n+/g, " ").trim() : "";
  const iconBox = iconUrl
    ? iconTile(iconUrl, "36px")
    : {
        type: "box",
        layout: "vertical",
        width: "36px",
        height: "36px",
        backgroundColor: COLORS.border,
        cornerRadius: "6px",
        justifyContent: "center",
        alignItems: "center",
        contents: [{ type: "text", text: "？", color: COLORS.muted, size: "xs", align: "center" }],
      };

  return {
    type: "box",
    layout: "horizontal",
    paddingTop: "8px",
    paddingBottom: "8px",
    paddingStart: "0px",
    paddingEnd: "0px",
    alignItems: "flex-start",
    spacing: "md",
    contents: [
      iconBox,
      {
        type: "box",
        layout: "vertical",
        flex: 1,
        spacing: "xs",
        contents: [
          {
            type: "text",
            text: `${name}`,
            color: COLORS.ink,
            size: "sm",
            weight: "bold",
            wrap: false,
          },
          summaryText
            ? {
                type: "text",
                text: summaryText,
                color: COLORS.muted,
                size: "xxs",
                wrap: true,
                maxLines: 2,
              }
            : {
                type: "text",
                text: `#${id}`,
                color: COLORS.border,
                size: "xxs",
              },
        ],
      },
      {
        type: "text",
        text: "›",
        color: COLORS.primary,
        size: "lg",
        flex: 0,
        align: "end",
      },
    ],
    action: {
      type: "message",
      text: `.item ${id}`,
    },
  };
};

/**
 * 產出物品搜尋結果 bubble（依類型分組，含頁首色帶）
 * @param {string} title 類型標題
 * @param {array} rows 由 genSearchRow 產生的陣列
 */
exports.genSearchBubble = (title, rows = []) => {
  // 分隔線：每兩列中間插一條淡線
  const divided = [];
  rows.forEach((row, i) => {
    divided.push(row);
    if (i < rows.length - 1) {
      divided.push({ type: "separator", color: COLORS.border });
    }
  });

  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: COLORS.card,
      paddingAll: "0px",
      contents: [
        // header strip — matches primary colour band of hero/icon-header bubbles
        {
          type: "box",
          layout: "horizontal",
          backgroundColor: COLORS.primary,
          paddingTop: "12px",
          paddingBottom: "10px",
          paddingStart: "16px",
          paddingEnd: "16px",
          alignItems: "center",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "vertical",
              width: "4px",
              height: "18px",
              backgroundColor: COLORS.card,
              cornerRadius: "2px",
              contents: [],
            },
            {
              type: "text",
              text: `${title}`,
              color: COLORS.card,
              size: "md",
              weight: "bold",
              flex: 1,
            },
            typeBadge(title),
          ],
        },
        // rows area
        {
          type: "box",
          layout: "vertical",
          paddingTop: "4px",
          paddingBottom: "8px",
          paddingStart: "16px",
          paddingEnd: "16px",
          contents: divided,
        },
      ],
    },
  };
};

/**
 * 產出一個純圖片的`bubble`
 * @param {String} src 圖片網址
 */
exports.genImageBubble = (name, src) => {
  return {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `${name}`,
          size: "lg",
          weight: "bold",
          align: "center",
        },
      ],
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "image",
          url: src,
          size: "full",
          aspectMode: "fit",
        },
      ],
      paddingAll: "0px",
    },
  };
};

/**
 * 產出物品屬性`row`
 * @param {String} key  標題
 * @param {String} value  數值
 */
exports.genAttributeRow = (key, value) => {
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "text",
        text: `${key}`,
        align: "center",
      },
      {
        type: "text",
        text: `${value}`,
        align: "center",
      },
    ],
  };
};

/**
 * 屬性`bubble`
 * @param {String} title 標題
 * @param {Array} rows 透過`genAttributeRow`產出的橫bar
 */
exports.genAttributeBubble = rows => {
  return {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "屬性一覽",
          size: "lg",
          weight: "bold",
          align: "center",
        },
      ],
    },
    body: {
      type: "box",
      layout: "vertical",
      paddingAll: "0px",
      contents: [
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          paddingAll: "3px",
          contents: rows,
        },
      ],
    },
  };
};

exports.genCompareBubble = (title, rows) => {
  return {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `${title} 的比較差異`,
          align: "center",
          size: "lg",
        },
      ],
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "屬性",
              weight: "bold",
              align: "center",
            },
            {
              type: "text",
              text: "數值",
              weight: "bold",
              align: "center",
            },
            {
              type: "text",
              text: "差異",
              weight: "bold",
              align: "center",
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          margin: "sm",
          contents: rows,
        },
      ],
    },
  };
};

exports.genCompareRow = (title, raw, diff) => {
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "text",
        text: `${title}`,
        align: "center",
      },
      {
        type: "text",
        text: `${raw}`,
        align: "center",
      },
      {
        type: "text",
        text: `${diff}`,
        align: "center",
        color: `${diff >= 0 ? "#3040FF" : "#FF3040"}`,
      },
    ],
  };
};

exports.genWeightedBubble = (equipA, equipB, rows) => {
  return {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "加權計算",
          align: "center",
          size: "lg",
        },
      ],
      paddingBottom: "3px",
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              contents: [
                {
                  type: "span",
                  text: `${equipB}`,
                  color: "#315423",
                },
                {
                  type: "span",
                  text: " 換成 ",
                },
                {
                  type: "span",
                  text: `${equipA}`,
                  color: "#491254",
                },
              ],
              align: "center",
              weight: "bold",
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          contents: rows,
          paddingAll: "5px",
          spacing: "sm",
        },
        {
          type: "separator",
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              size: "sm",
              color: "#808080",
              contents: [
                {
                  type: "span",
                  text: "註解：",
                },
                {
                  type: "span",
                  text: "1. 依照不同流派計算出的加權值",
                },
              ],
            },
            {
              type: "text",
              size: "sm",
              color: "#808080",
              contents: [
                {
                  type: "span",
                  text: "註解：",
                  color: "#FFFFFF",
                },
                {
                  type: "span",
                  text: "2. 打勾為推薦更換",
                },
              ],
            },
            {
              type: "text",
              size: "sm",
              color: "#808080",
              contents: [
                {
                  type: "span",
                  text: "註解：",
                  color: "#FFFFFF",
                },
                {
                  type: "span",
                  text: "3. 分數越低更換的CP值越低",
                },
              ],
            },
          ],
        },
      ],
      spacing: "sm",
    },
  };
};

exports.genWeightedRow = (type, weight) => {
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "text",
        contents: [
          { type: "span", text: "如果你是" },
          { type: "span", text: " " },
          { type: "span", text: `${type}`, size: "sm" },
        ],
        flex: 6,
      },
      {
        type: "text",
        text: "差異值",
        size: "sm",
        align: "center",
        flex: 2,
      },
      {
        type: "text",
        text: `${weight}`,
        align: "end",
        flex: 2,
      },
      {
        type: "text",
        text: weight > 0 ? "✔️" : "❌",
        align: "center",
        flex: 1,
      },
    ],
  };
};

exports.genRankBubble = rows => {
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: COLORS.card,
      paddingAll: "0px",
      contents: [
        // header strip
        {
          type: "box",
          layout: "horizontal",
          backgroundColor: COLORS.primary,
          paddingTop: "12px",
          paddingBottom: "10px",
          paddingStart: "16px",
          paddingEnd: "16px",
          alignItems: "center",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "vertical",
              width: "4px",
              height: "18px",
              backgroundColor: COLORS.card,
              cornerRadius: "2px",
              contents: [],
            },
            {
              type: "text",
              text: "排行計算",
              color: COLORS.card,
              size: "md",
              weight: "bold",
              flex: 1,
            },
          ],
        },
        // column-label sub-header
        // ponytail: flex weights mirror the row layout (rank badge → flex:2, icon → flex:2,
        // name → flex:5, score → flex:2); text nodes can't take width in LINE Flex.
        {
          type: "box",
          layout: "horizontal",
          backgroundColor: COLORS.background,
          paddingTop: "6px",
          paddingBottom: "6px",
          paddingStart: "16px",
          paddingEnd: "16px",
          contents: [
            {
              type: "text",
              text: "排",
              color: COLORS.muted,
              size: "xxs",
              weight: "bold",
              align: "center",
              flex: 2,
            },
            { type: "text", text: "　", color: COLORS.muted, size: "xxs", flex: 2 },
            {
              type: "text",
              text: "名稱",
              color: COLORS.muted,
              size: "xxs",
              weight: "bold",
              flex: 5,
            },
            {
              type: "text",
              text: "分數",
              color: COLORS.muted,
              size: "xxs",
              weight: "bold",
              align: "end",
              flex: 2,
            },
          ],
        },
        // rows
        {
          type: "box",
          layout: "vertical",
          paddingTop: "4px",
          paddingBottom: "8px",
          paddingStart: "16px",
          paddingEnd: "16px",
          spacing: "none",
          contents: rows,
        },
      ],
    },
  };
};

/**
 * 排行榜單列（含圖示 + 名稱 + 加權分數，可點擊）
 * @param {number} rank
 * @param {Object} equip  item 物件，需含 weighted 欄位
 * @param {string|null} iconUrl
 */
exports.genRankRow = (rank, equip, iconUrl) => {
  let { name, weighted, id } = equip;

  // top-3 rank badges get accent colours
  const rankColors = [COLORS.primary, COLORS.celadon, COLORS.indigo];
  const rankColor = rank <= 3 ? rankColors[rank - 1] : COLORS.muted;

  const iconBox = iconUrl
    ? iconTile(iconUrl, "32px")
    : {
        type: "box",
        layout: "vertical",
        width: "32px",
        height: "32px",
        backgroundColor: COLORS.border,
        cornerRadius: "6px",
        justifyContent: "center",
        alignItems: "center",
        contents: [{ type: "text", text: "？", color: COLORS.muted, size: "xxs", align: "center" }],
      };

  return {
    type: "box",
    layout: "horizontal",
    paddingTop: "6px",
    paddingBottom: "6px",
    alignItems: "center",
    spacing: "sm",
    contents: [
      // rank badge: fixed-width circle-ish box
      {
        type: "box",
        layout: "vertical",
        width: "28px",
        height: "28px",
        backgroundColor: rankColor,
        cornerRadius: "14px",
        justifyContent: "center",
        alignItems: "center",
        flex: 0,
        contents: [
          {
            type: "text",
            text: `${rank}`,
            color: COLORS.card,
            size: "xs",
            weight: "bold",
            align: "center",
          },
        ],
      },
      // icon
      iconBox,
      // name (flex:1 so it fills remaining space and truncates cleanly)
      {
        type: "text",
        text: `${name}`,
        color: COLORS.ink,
        size: "xs",
        weight: "bold",
        flex: 1,
        wrap: false,
      },
      // score
      {
        type: "text",
        text: `${weighted}`,
        color: rankColor,
        size: "xs",
        weight: "bold",
        align: "end",
        flex: 2,
      },
    ],
    action: { type: "message", text: `.item ${id}` },
  };
};
