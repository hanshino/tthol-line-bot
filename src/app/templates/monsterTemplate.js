/**
 * 產出怪物資料flex
 * @param {Object}  params 參數
 * @param {String}  params.name
 * @param {String}  params.elemental
 * @param {Number}  params.level
 * @param {Number}  params.hp
 */
exports.genMonsterRow = params => {
  let { name, elemental, level, hp, id } = params;
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "text",
        text: `${name}`,
        size: "sm",
        flex: 5,
      },
      {
        type: "text",
        text: `${elemental}`,
        size: "sm",
        flex: 2,
      },
      {
        type: "text",
        text: `${level}`,
        size: "sm",
        flex: 2,
      },
      {
        type: "text",
        text: `${hp}`,
        size: "xs",
        flex: 3,
      },
    ],
    action: {
      type: "message",
      text: `.monster ${id}`,
    },
  };
};

exports.genMonsterBubble = rows => {
  return {
    type: "bubble",
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
              text: "名稱",
              flex: 5,
            },
            {
              type: "text",
              text: "屬性",
              flex: 2,
            },
            {
              type: "text",
              text: "等級",
              flex: 2,
            },
            {
              type: "text",
              text: "HP",
              flex: 3,
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "md",
          paddingAll: "3px",
          contents: rows,
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
        color: "#808080",
      },
    ],
  };
};

exports.genAttributeBubble = (title, rows) => {
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `${title}`,
          weight: "bold",
        },
        {
          type: "box",
          layout: "vertical",
          contents: rows,
        },
      ],
    },
  };
};

exports.genAttributeRow = (title, value) => {
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
        text: `${value}`,
        align: "center",
      },
    ],
  };
};
