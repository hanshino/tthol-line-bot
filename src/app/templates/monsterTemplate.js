// ponytail: COLORS and small helpers duplicated from itemTemplate.js intentionally —
// keeps both templates independently editable without shared coupling.
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

// Elemental accent colours for the badge chips on list rows
const ELEMENTAL_COLOR = {
  火: "#b6322d",
  水: "#2c6194",
  電: "#744c7d",
  木: "#54967a",
  無: "#585e68",
};

function elementalColor(el) {
  return ELEMENTAL_COLOR[el] || COLORS.muted;
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

function iconPlaceholder(size) {
  return {
    type: "box",
    layout: "vertical",
    width: size,
    height: size,
    backgroundColor: COLORS.border,
    cornerRadius: "8px",
    justifyContent: "center",
    alignItems: "center",
    contents: [{ type: "text", text: "？", color: COLORS.muted, size: "xxs", align: "center" }],
  };
}

function sectionTitle(label, accentColor) {
  return {
    type: "box",
    layout: "horizontal",
    paddingStart: "16px",
    paddingEnd: "16px",
    paddingTop: "6px",
    paddingBottom: "8px",
    alignItems: "center",
    contents: [
      {
        type: "box",
        layout: "vertical",
        width: "3px",
        height: "14px",
        backgroundColor: accentColor || COLORS.primary,
        cornerRadius: "2px",
        contents: [],
      },
      {
        type: "text",
        text: label,
        color: COLORS.ink,
        size: "sm",
        weight: "bold",
        margin: "md",
      },
    ],
  };
}

/**
 * 怪物搜尋結果列（含圖示）
 * @param {Object} data npc row
 * @param {string|null} iconUrl
 */
exports.genMonsterRow = (data, iconUrl) => {
  let { name, elemental, level, hp, id } = data;
  const elColor = elementalColor(elemental);

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
      iconUrl ? iconTile(iconUrl, "36px") : iconPlaceholder("36px"),
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
          {
            type: "box",
            layout: "horizontal",
            spacing: "sm",
            contents: [
              // elemental badge
              {
                type: "box",
                layout: "vertical",
                backgroundColor: elColor,
                cornerRadius: "10px",
                paddingTop: "2px",
                paddingBottom: "2px",
                paddingStart: "7px",
                paddingEnd: "7px",
                flex: 0,
                contents: [
                  {
                    type: "text",
                    text: `${elemental || "無"}`,
                    color: COLORS.card,
                    size: "xxs",
                    weight: "bold",
                  },
                ],
              },
              {
                type: "text",
                text: `Lv.${level}`,
                color: COLORS.muted,
                size: "xxs",
                flex: 0,
              },
              {
                type: "text",
                text: `HP ${hp}`,
                color: COLORS.muted,
                size: "xxs",
                flex: 1,
                wrap: false,
              },
            ],
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
      text: `.monster ${id}`,
    },
  };
};

/**
 * 怪物搜尋結果 bubble
 * @param {Array} rows genMonsterRow 產生的陣列
 */
exports.genMonsterBubble = rows => {
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
              text: "怪物搜尋",
              color: COLORS.card,
              size: "md",
              weight: "bold",
              flex: 1,
            },
          ],
        },
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
 * 其餘XXX個結果提示訊息
 * @param {Number} other
 */
exports.genOtherResultBox = other => {
  return {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: `... 其餘${other}個結果`,
        size: "xs",
        color: COLORS.muted,
      },
    ],
  };
};

/**
 * 怪物屬性 bubble（基本/傷害/防禦 三種之一）
 * @param {Object} monster  npc row（含 name/level）
 * @param {string|null} iconUrl
 * @param {string} title    section 標題
 * @param {Array} rows      由 genAttributeRow 產生
 */
exports.genAttributeBubble = (monster, iconUrl, title, rows) => {
  const iconBox = iconUrl ? iconTile(iconUrl, "44px") : iconPlaceholder("44px");

  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: COLORS.card,
      paddingAll: "0px",
      contents: [
        // primary header band: icon + name + level badge
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
                  text: `${monster.name || ""}`,
                  color: COLORS.card,
                  size: "lg",
                  weight: "bold",
                  wrap: true,
                },
                {
                  type: "box",
                  layout: "horizontal",
                  spacing: "sm",
                  contents: [
                    {
                      type: "box",
                      layout: "vertical",
                      backgroundColor: elementalColor(monster.elemental),
                      cornerRadius: "10px",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      paddingStart: "7px",
                      paddingEnd: "7px",
                      flex: 0,
                      contents: [
                        {
                          type: "text",
                          text: `${monster.elemental || "無"}`,
                          color: COLORS.card,
                          size: "xxs",
                          weight: "bold",
                        },
                      ],
                    },
                    {
                      type: "text",
                      text: `Lv.${monster.level || ""}`,
                      color: COLORS.card,
                      size: "xs",
                      flex: 0,
                    },
                  ],
                },
              ],
            },
          ],
        },
        // section title
        sectionTitle(title, COLORS.celadon),
        // striped attribute rows
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
  };
};

/**
 * 怪物屬性行（label + value，仿 itemTemplate genStatRow）
 * @param {string} label
 * @param {*} value
 */
exports.genAttributeRow = (label, value) => ({
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
      text: `${value != null ? value : "—"}`,
      color: COLORS.ink,
      size: "sm",
      weight: "bold",
      align: "end",
      flex: 2,
    },
  ],
});

/**
 * 掉落物品 bubble（chip 列表）。items 為空時回傳 null。
 * @param {string} monsterName
 * @param {string[]} itemNames
 * @returns {Object|null}
 */
exports.genDropBubble = (monsterName, itemNames) => {
  const names = itemNames.filter(Boolean);
  if (names.length === 0) return null;

  // 2-per-row chip grid（LINE Flex 無 flex-wrap）
  const CHUNK = 2;
  const chunks = [];
  for (let i = 0; i < names.length; i += CHUNK) {
    chunks.push(names.slice(i, i + CHUNK));
  }

  const chipRows = chunks.map(chunk => ({
    type: "box",
    layout: "horizontal",
    spacing: "sm",
    paddingTop: "4px",
    paddingBottom: "0px",
    contents: chunk.map(name => ({
      type: "box",
      layout: "vertical",
      flex: 1,
      backgroundColor: COLORS.background,
      borderColor: COLORS.border,
      borderWidth: "1px",
      cornerRadius: "6px",
      paddingTop: "5px",
      paddingBottom: "5px",
      paddingStart: "8px",
      paddingEnd: "8px",
      contents: [
        {
          type: "text",
          text: name,
          color: COLORS.ink,
          size: "xs",
          wrap: false,
        },
      ],
    })),
  }));

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
          layout: "vertical",
          backgroundColor: COLORS.primary,
          paddingTop: "14px",
          paddingBottom: "14px",
          paddingStart: "16px",
          paddingEnd: "16px",
          contents: [
            {
              type: "text",
              text: `${monsterName || ""}`,
              color: COLORS.card,
              size: "sm",
              weight: "bold",
            },
          ],
        },
        sectionTitle("掉落物品", COLORS.indigo),
        {
          type: "box",
          layout: "vertical",
          paddingStart: "16px",
          paddingEnd: "16px",
          paddingBottom: "16px",
          spacing: "none",
          contents: chipRows,
        },
      ],
    },
  };
};
