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

// 千分位：Number.prototype.toLocaleString 在不同 runtime/ICU 下結果不一致，直接用 regex。
function fmt(n) {
  return `${Number(n) || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function header(title, badge, subtitle) {
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
            text: `${title}`,
            color: COLORS.card,
            size: "lg",
            weight: "bold",
            flex: 1,
            wrap: true,
          },
          badge && {
            // 徽章一律 box 包 text：text 不支援 backgroundColor/cornerRadius/padding*
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
                text: `${badge}`,
                color: COLORS.card,
                size: "sm",
                weight: "bold",
                align: "center",
              },
            ],
          },
        ].filter(Boolean),
      },
      subtitle && {
        type: "text",
        text: `${subtitle}`,
        color: "#f0d9d5",
        size: "xs",
        margin: "xs",
        wrap: true,
      },
    ].filter(Boolean),
  };
}

function section(label, tag, accent) {
  return {
    type: "box",
    layout: "horizontal",
    alignItems: "center",
    margin: "lg",
    paddingStart: "15px",
    paddingEnd: "15px",
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
      {
        type: "text",
        text: `${label}`,
        color: COLORS.ink,
        size: "sm",
        weight: "bold",
        margin: "md",
      },
      tag && {
        type: "text",
        text: `${tag}`,
        color: COLORS.muted,
        size: "xxs",
        align: "end",
        flex: 1,
      },
    ].filter(Boolean),
  };
}

// 首字方磚，比照 magicTemplate.js selectChip 的視覺語彙
function charTile(name, accent) {
  return {
    type: "box",
    layout: "vertical",
    width: "28px",
    height: "28px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2e2df",
    cornerRadius: "8px",
    flex: 0,
    contents: [
      {
        type: "text",
        text: `${name}`.charAt(0),
        color: accent || COLORS.primary,
        size: "sm",
        weight: "bold",
        align: "center",
      },
    ],
  };
}

function chip(name, caption, messageText, accent) {
  return {
    type: "box",
    layout: "horizontal",
    alignItems: "center",
    spacing: "sm",
    flex: 1,
    height: "50px",
    paddingAll: "8px",
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
    borderWidth: "1px",
    cornerRadius: "12px",
    action: { type: "message", text: messageText },
    contents: [
      charTile(name, accent),
      {
        type: "box",
        layout: "vertical",
        flex: 1,
        contents: [
          {
            type: "text",
            text: `${name}`,
            color: COLORS.ink,
            size: "sm",
            weight: "bold",
            wrap: false,
          },
          { type: "text", text: `${caption}`, color: COLORS.muted, size: "xxs", wrap: false },
        ],
      },
    ],
  };
}

function chipRows(chips) {
  const rows = [];
  for (let i = 0; i < chips.length; i += 2) {
    rows.push({
      type: "box",
      layout: "horizontal",
      spacing: "sm",
      contents: [chips[i], chips[i + 1] || { type: "filler" }],
    });
  }
  return rows;
}

function chipBubble(headerBox, sectionBox, rows, footNote) {
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: COLORS.card,
      paddingAll: "0px",
      contents: [
        headerBox,
        sectionBox,
        {
          type: "box",
          layout: "vertical",
          margin: "sm",
          paddingStart: "15px",
          paddingEnd: "15px",
          paddingBottom: "15px",
          spacing: "sm",
          contents: rows,
        },
        footNote && {
          type: "text",
          text: `${footNote}`,
          color: COLORS.muted,
          size: "xxs",
          wrap: true,
          align: "center",
          margin: "none",
        },
        footNote && { type: "box", layout: "vertical", height: "12px", contents: [] },
      ].filter(Boolean),
    },
  };
}

// 循環強調色，讓相鄰的分類方磚不會全部同色
const ACCENTS = [COLORS.primary, COLORS.indigo, COLORS.celadon, COLORS.plum];

/**
 * 分類選單 bubble（點擊分類 → 送出 `.成就 <分類名稱>`）
 * @param {Array<{id:number, name:string, subCats:Array<{id:number,name:string,count:number,totalPoints:number}>}>} categories
 */
exports.genCategoryBubble = categories => {
  const list = categories || [];
  const totalItems = list.reduce(
    (sum, c) => sum + (c.subCats || []).reduce((s, sc) => s + (sc.count || 0), 0),
    0
  );
  const chips = list.map((category, index) => {
    const subCats = category.subCats || [];
    const count = subCats.reduce((sum, sc) => sum + (sc.count || 0), 0);
    const points = subCats.reduce((sum, sc) => sum + (sc.totalPoints || 0), 0);
    return chip(
      `${category.name}`,
      `${subCats.length} 類 · ${fmt(count)} 項 · ${fmt(points)} 點`,
      `.成就 ${category.name}`,
      ACCENTS[index % ACCENTS.length]
    );
  });

  return chipBubble(
    header("成就總覽", `${list.length} 類`, `共 ${fmt(totalItems)} 項成就 · 點擊分類查看細項`),
    section("請選擇成就分類"),
    chipRows(chips),
    "點擊方磚後會再列出該分類的子分類"
  );
};

/**
 * 子分類選單 bubble（點擊子分類 → 送出 `.成就 <分類名稱> <子分類名稱>`）
 * @param {string} categoryName
 * @param {Array<{id:number, name:string, count:number, totalPoints:number}>} subCats
 */
exports.genSubCatBubble = (categoryName, subCats) => {
  const list = subCats || [];
  const totalItems = list.reduce((sum, sc) => sum + (sc.count || 0), 0);
  const totalPoints = list.reduce((sum, sc) => sum + (sc.totalPoints || 0), 0);
  const chips = list.map((subCat, index) =>
    chip(
      `${subCat.name}`,
      `${fmt(subCat.count)} 項 · ${fmt(subCat.totalPoints)} 點`,
      `.成就 ${categoryName} ${subCat.name}`,
      ACCENTS[index % ACCENTS.length]
    )
  );

  return chipBubble(
    header(
      `${categoryName}`,
      `${list.length} 類`,
      `共 ${fmt(totalItems)} 項 · ${fmt(totalPoints)} 點 · 點擊子分類查看成就`
    ),
    section("請選擇子分類", `${categoryName}`),
    chipRows(chips)
  );
};

function pill(text, background, color, borderColor) {
  const box = {
    type: "box",
    layout: "vertical",
    flex: 0,
    cornerRadius: "10px",
    paddingTop: "2px",
    paddingBottom: "2px",
    paddingStart: "7px",
    paddingEnd: "7px",
    contents: [
      { type: "text", text: `${text}`, color, size: "xxs", weight: "bold", align: "center" },
    ],
  };
  if (background) box.backgroundColor = background;
  if (borderColor) {
    box.borderColor = borderColor;
    box.borderWidth = "1px";
  }
  return box;
}

/**
 * 單筆成就列（不是完整 bubble，交給 genAchievementBubble 組成）
 * @param {{name:string, description:string, points:number, resetType:number,
 *          rewardLabel:string|null, rewardAction:string|null}} achievement
 */
exports.genAchievementRow = achievement => {
  const data = achievement || {};
  const description = `${data.description || ""}`.replace(/\\n+/g, " ").trim();
  const reward = data.rewardLabel ? `${data.rewardLabel}` : "";

  const titleLine = {
    type: "box",
    layout: "horizontal",
    alignItems: "center",
    spacing: "xs",
    contents: [
      {
        type: "text",
        text: `${data.name || ""}`,
        color: COLORS.ink,
        size: "sm",
        weight: "bold",
        flex: 1,
        wrap: false,
      },
      Number(data.resetType) > 0 && pill("週期重置", null, COLORS.indigo, COLORS.indigo),
      pill(`${fmt(data.points)} 點`, COLORS.primary, COLORS.card),
    ].filter(Boolean),
  };

  const rewardLine = reward && {
    type: "box",
    layout: "horizontal",
    alignItems: "center",
    spacing: "xs",
    margin: "xs",
    contents: [
      {
        type: "box",
        layout: "vertical",
        width: "3px",
        height: "10px",
        cornerRadius: "2px",
        backgroundColor: COLORS.celadon,
        flex: 0,
        contents: [],
      },
      {
        type: "text",
        text: reward,
        color: data.rewardAction ? COLORS.celadon : COLORS.muted,
        size: "xxs",
        weight: data.rewardAction ? "bold" : "regular",
        flex: 1,
        wrap: false,
      },
      data.rewardAction && {
        type: "text",
        text: "查看 ›",
        color: COLORS.celadon,
        size: "xxs",
        align: "end",
        flex: 0,
      },
    ].filter(Boolean),
  };
  // 只有獎勵那一行可點，避免整列誤觸；rewardAction 為 null 時就是純文字。
  if (rewardLine && data.rewardAction)
    rewardLine.action = { type: "message", text: `${data.rewardAction}` };

  return {
    type: "box",
    layout: "vertical",
    paddingTop: "8px",
    paddingBottom: "8px",
    paddingStart: "10px",
    paddingEnd: "10px",
    contents: [
      titleLine,
      description && {
        type: "text",
        text: description,
        color: COLORS.muted,
        size: "xxs",
        wrap: true,
        maxLines: 2,
        margin: "xs",
        lineSpacing: "3px",
      },
      rewardLine,
    ].filter(Boolean),
  };
};

/**
 * 把 N 筆成就列包成一張 bubble（供 carousel 連續呈現）
 * @param {string} title 例如「征戰 - 降魔誅妖」
 * @param {Array} rows genAchievementRow 產出的橫列
 */
exports.genAchievementBubble = (title, rows) => {
  const list = rows || [];
  return {
    type: "bubble",
    size: "mega",
    body: {
      type: "box",
      layout: "vertical",
      backgroundColor: COLORS.card,
      paddingAll: "0px",
      contents: [
        header(`${title}`, `${list.length} 項`),
        section("成就明細", "點擊獎勵可查詢"),
        {
          // 交替底色的列不包 border+cornerRadius 外框：LINE Flex 不裁切子層，
          // 子列的方角底色會從圓角外框露出來（見 AGENTS.md / itemTemplate.genStatsBubble）。
          type: "box",
          layout: "vertical",
          margin: "sm",
          paddingStart: "15px",
          paddingEnd: "15px",
          paddingBottom: "15px",
          spacing: "none",
          contents: list.map((row, index) =>
            Object.assign({}, row, {
              backgroundColor: index % 2 === 0 ? COLORS.background : COLORS.card,
            })
          ),
        },
      ],
    },
  };
};
