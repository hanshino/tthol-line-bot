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

const CLAN_ZH = {
  CLASS_SHAULIN: "少林",
  CLASS_MONTO: "曼陀",
  CLASS_MONTO_KYLIN: "麒麟",
  CLASS_SKY: "天外天",
  CLASS_FLOWER: "移花宮",
  CLASS_FOX: "火狐",
  CLASS_FOX_SNOW: "雪狼",
  CLASS_FOX_NONE: "火狐 (無派)",
  CLASS_BAD: "惡人谷",
  CLASS_ISLE: "無名島",
  CLASS_GOD: "神武門",
  CLASS_MAGIC: "天師",
  CLASS_LOVE: "戀人",
  CLASS_GUILD: "家族",
  CLASS_CHILD: "入門弟子",
  CLASS_NONE: "無派系",
};

const TARGET_ZH = {
  TARGET_ENEMYTARGET: "單體敵人",
  TARGET_ENEMY: "敵人",
  TARGET_ENEMYEX: "敵人 (擴)",
  TARGET_PASSIVE: "被動",
  TARGET_SELF: "自身",
  TARGET_ALLY: "友軍",
  TARGET_GROUP: "範圍",
  TARGET_GROUP_ONE: "範圍 (單次)",
  TARGET_SIEGE_GROUND: "攻城地面",
  TARGET_LOVE: "情侶",
};

function clanZh(clan) {
  return clan ? CLAN_ZH[clan] || clan : "生活/商業";
}

function targetZh(target) {
  return target ? TARGET_ZH[target] || target : "—";
}

function section(label, tag, accent) {
  return {
    type: "box",
    layout: "horizontal",
    alignItems: "center",
    margin: "lg",
    contents: [
      {
        type: "box",
        layout: "vertical",
        width: "3px",
        height: "14px",
        cornerRadius: "2px",
        backgroundColor: accent || COLORS.primary,
        contents: [],
      },
      { type: "text", text: label, color: COLORS.ink, size: "sm", weight: "bold", margin: "md" },
      tag && { type: "text", text: tag, color: COLORS.muted, size: "xxs", align: "end", flex: 1 },
    ].filter(Boolean),
  };
}

function header(title, badge, subtitle, big) {
  return {
    type: "box",
    layout: "vertical",
    backgroundColor: COLORS.primary,
    paddingTop: "13px",
    paddingBottom: "14px",
    paddingStart: "15px",
    paddingEnd: "15px",
    contents: [
      {
        type: "box",
        layout: "horizontal",
        alignItems: "center",
        contents: [
          {
            type: "text",
            text: title,
            color: COLORS.card,
            size: big ? "xl" : "lg",
            weight: "bold",
            flex: 1,
            wrap: true,
          },
          {
            // LINE Flex 只允許 backgroundColor/cornerRadius/padding 出現在 box，
            // text 元件不支援這些欄位（曾造成 LINE API 400 unknown field）。
            // 徽章一律用 box 包一層 text，比照 itemTemplate.js 的 typeBadge()。
            type: "box",
            layout: "vertical",
            backgroundColor: "#c85c57",
            cornerRadius: "20px",
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingStart: "10px",
            paddingEnd: "10px",
            flex: 0,
            contents: [
              {
                type: "text",
                text: badge,
                color: COLORS.card,
                size: "sm",
                weight: "bold",
                align: "center",
              },
            ],
          },
        ],
      },
      subtitle && {
        type: "text",
        text: subtitle,
        color: "#f0d9d5",
        size: "xs",
        margin: "xs",
        wrap: true,
      },
    ].filter(Boolean),
  };
}

function valueColor(key) {
  if (key.indexOf("mp") >= 0) return COLORS.indigo;
  if (key.indexOf("hit") >= 0) return COLORS.celadon;
  return COLORS.ink;
}

exports.clanZh = clanZh;
exports.targetZh = targetZh;

exports.genAttributeRow = (title, value, color) => ({
  type: "box",
  layout: "horizontal",
  paddingTop: "9px",
  paddingBottom: "9px",
  paddingStart: "12px",
  paddingEnd: "12px",
  backgroundColor: COLORS.background,
  contents: [
    { type: "text", text: `${title}`, color: COLORS.muted, size: "xs", flex: 3 },
    {
      type: "text",
      text: `${value}`,
      color: color || COLORS.ink,
      size: "sm",
      weight: "bold",
      align: "end",
      wrap: true,
      flex: 5,
    },
  ],
});

exports.genMagicBubble = (magic, basicRows, statRows) => ({
  type: "bubble",
  size: "mega",
  body: {
    type: "box",
    layout: "vertical",
    backgroundColor: COLORS.card,
    paddingAll: "0px",
    contents: [
      header(
        `${magic.name}`,
        `Lv.${magic.level}`,
        `${clanZh(magic.clan)}${magic.clan2 && magic.clan2 !== magic.clan ? ` · ${clanZh(magic.clan2)}` : ""} · ${targetZh(magic.target)}`,
        true
      ),
      magic.help && [
        section("說明", "技能效果"),
        {
          type: "box",
          layout: "vertical",
          backgroundColor: "#f6eee9",
          borderColor: "#ecdcd6",
          borderWidth: "1px",
          cornerRadius: "12px",
          margin: "sm",
          paddingAll: "12px",
          contents: [
            { type: "text", text: `${magic.help}`, color: COLORS.ink, size: "sm", wrap: true },
          ],
        },
      ],
      [
        section("基本資料"),
        {
          type: "box",
          layout: "vertical",
          borderColor: COLORS.border,
          borderWidth: "1px",
          cornerRadius: "12px",
          overflow: "hidden",
          contents: basicRows,
        },
      ],
      [
        section("數值參數", `Lv.${magic.level}`),
        {
          type: "box",
          layout: "vertical",
          borderColor: COLORS.border,
          borderWidth: "1px",
          cornerRadius: "12px",
          overflow: "hidden",
          contents: statRows,
        },
      ],
    ]
      .flat()
      .filter(Boolean),
  },
});

function selectChip(data) {
  const name = `${data.name}`;
  return {
    type: "box",
    layout: "horizontal",
    alignItems: "center",
    spacing: "sm",
    flex: 1,
    minHeight: "46px",
    paddingAll: "8px",
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: "1px",
    cornerRadius: "12px",
    action: { type: "message", text: `.skill ${data.id} ${data.level}` },
    contents: [
      {
        type: "box",
        layout: "vertical",
        width: "26px",
        height: "26px",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2e2df",
        cornerRadius: "8px",
        contents: [
          { type: "text", text: name.charAt(0), color: COLORS.primary, size: "sm", weight: "bold" },
        ],
      },
      {
        type: "box",
        layout: "vertical",
        flex: 1,
        contents: [
          { type: "text", text: name, color: COLORS.ink, size: "sm", weight: "bold", wrap: false },
          { type: "text", text: `Lv.${data.level}`, color: COLORS.muted, size: "xxs" },
        ],
      },
    ],
  };
}

exports.genSearchBubble = (searchTerm, skills) => {
  const chips = skills.map(selectChip);
  const rows = [];
  for (let i = 0; i < chips.length; i += 2)
    rows.push({
      type: "box",
      layout: "horizontal",
      spacing: "sm",
      contents: [chips[i], chips[i + 1] || { type: "filler" }],
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
        header(
          "技能搜尋結果",
          `${skills.length} 筆`,
          `關鍵字「${searchTerm}」· 點擊技能查看詳細資料`
        ),
        section("請選擇要查詢的技能"),
        {
          type: "box",
          layout: "vertical",
          paddingStart: "15px",
          paddingEnd: "15px",
          spacing: "sm",
          contents: rows,
        },
      ],
    },
  };
};

exports.genSelectBubble = (name, id, maxLevel, currentLevel) => {
  const chips = Array.from({ length: maxLevel }).map((_, index) => {
    const level = index + 1;
    const chip = {
      type: "box",
      layout: "vertical",
      flex: 1,
      height: "40px",
      justifyContent: "center",
      alignItems: "center",
      cornerRadius: "11px",
      backgroundColor: level === Number(currentLevel) ? COLORS.primary : COLORS.background,
      borderColor: level === Number(currentLevel) ? COLORS.primary : COLORS.border,
      borderWidth: "1px",
      contents: [
        {
          type: "text",
          text: `Lv.${level}`,
          color: level === Number(currentLevel) ? COLORS.card : COLORS.ink,
          size: "sm",
          weight: "bold",
        },
      ],
    };
    if (level !== Number(currentLevel))
      chip.action = { type: "message", text: `.skill ${id} ${level}` };
    return chip;
  });
  const rows = [];
  for (let i = 0; i < chips.length; i += 4)
    rows.push({
      type: "box",
      layout: "horizontal",
      spacing: "sm",
      contents: chips.slice(i, i + 4),
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
        header("查看其他等級", `Lv.${currentLevel}`, `${name} · 共 ${maxLevel} 級`),
        section("點擊等級切換檢視"),
        {
          type: "box",
          layout: "vertical",
          paddingStart: "15px",
          paddingEnd: "15px",
          spacing: "sm",
          contents: rows,
        },
        {
          type: "box",
          layout: "horizontal",
          spacing: "sm",
          padding: "15px",
          contents: [
            { type: "text", text: "目前檢視", color: COLORS.muted, size: "xxs", flex: 0 },
            {
              type: "box",
              layout: "vertical",
              width: "20px",
              height: "12px",
              backgroundColor: COLORS.primary,
              cornerRadius: "4px",
              contents: [],
            },
            { type: "text", text: "可切換", color: COLORS.muted, size: "xxs", flex: 0 },
            {
              type: "box",
              layout: "vertical",
              width: "20px",
              height: "12px",
              backgroundColor: COLORS.background,
              borderColor: COLORS.border,
              borderWidth: "1px",
              cornerRadius: "4px",
              contents: [],
            },
          ],
        },
      ],
    },
  };
};

exports.valueColor = valueColor;
