/**
 * 取物品顯示的橫欄
 * @param {string} title 左邊標題
 * @param {string} description 右邊描述
 */
exports.genSearchRow = data => {
  let { name, summary, id, note } = data;
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
            text: `${note}`,
            flex: 1,
            size: "xs",
          },
          {
            type: "text",
            text: `${summary || "無"}`,
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
exports.genImageBubble = src => {
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "image",
          url: src,
          size: "full",
          aspectMode: "cover",
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
    body: {
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
