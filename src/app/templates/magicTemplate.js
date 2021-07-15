exports.genMagicBubble = (title, level, rows) => {
  return {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `${title} Lv.${level}`,
          size: "lg",
          weight: "bold",
          align: "center",
        },
      ],
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: rows,
    },
  };
};

/**
 * 技能說明橫列
 * @param {String} title
 * @param {String} value
 */
exports.genAttributeRow = (title, value) => {
  return {
    type: "box",
    layout: "horizontal",
    spacing: "xs",
    contents: [
      {
        type: "text",
        text: `${title}`,
        flex: 5,
        size: "xs",
        weight: "bold",
      },
      {
        type: "text",
        text: `${value}`,
        flex: 7,
        wrap: true,
        size: "xs",
      },
    ],
  };
};

/**
 * 提供選擇的等級技能按紐
 * @param {Object} params 參數
 * @param {Number} params.id 技能編號
 * @param {Number} params.text 顯示文字
 * @param {Number} params.level 技能等級
 */
exports.genSelectText = params => {
  let { text, id, level = "" } = params;
  return {
    type: "text",
    text: `${text}`,
    align: "center",
    action: { type: "message", text: `.skill ${id} ${level}`.trim() },
  };
};

/**
 * 建議最多放5個
 * @param {Array} texts 文字選擇物件
 */
exports.genSelectRow = texts => {
  return {
    type: "box",
    layout: "horizontal",
    contents: texts,
    spacing: "sm",
    paddingAll: "5px",
  };
};

/**
 * 建立選擇bubble
 * @param {Array} rows
 */
exports.genSelectBubble = rows => {
  return {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "查看其他等級",
          weight: "bold",
          align: "center",
        },
      ],
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: rows,
      spacing: "md",
    },
  };
};

exports.genSearchBubble = rows => {
  return {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "請選擇要查詢的技能",
          weight: "bold",
          align: "center",
        },
      ],
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: rows,
      spacing: "md",
    },
  };
};
