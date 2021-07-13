/**
 * 取物品顯示的橫欄
 * @param {string} title 左邊標題
 * @param {string} description 右邊描述
 */
exports.genSearchRow = data => {
  let { name, summary, id } = data;
  return {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: `${name}`,
        flex: 3,
        size: "sm",
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: `${summary.replace(/\\n+/g, "") || "無"}`,
            flex: 2,
            size: "xs",
          },
        ],
      },
    ],
    action: {
      type: "message",
      text: `.item ${id}`,
    },
  };
};

/**
 * 產出物品顯示的bubble
 * @param {string} title 標題
 * @param {array} rows 由`genRow`產生的物件陣列
 */
exports.genSearchBubble = (title, rows = []) => {
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `${title}`,
              weight: "bold",
              size: "lg",
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          spacing: "md",
          paddingAll: "3px",
          contents: [...rows],
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
                  text: `${equipA}`,
                  color: "#315423",
                },
                {
                  type: "span",
                  text: " 換 ",
                },
                {
                  type: "span",
                  text: `${equipB}`,
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
                  text: "3. 結果僅供參考",
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
        text: `如果你是 ${type}`,
        flex: 6,
      },
      {
        type: "text",
        text: `分數值 ${weight}`,
        flex: 5,
      },
      {
        type: "text",
        text: weight > 0 ? "✔️" : "❌",
        flex: 1,
      },
    ],
  };
};
