/**
 * 產出神武禁地解謎`flex`
 * @param {Array} numbers 解謎結果陣列
 */
exports.genGodQuestBubble = numbers => {
  return {
    type: "bubble",
    size: "micro",
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
              text: `${numbers[0]}`,
              align: "center",
            },
          ],
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "filler",
            },
            {
              type: "text",
              text: `${numbers[1]}`,
              align: "center",
              color: "#FF3040",
            },
            {
              type: "text",
              text: `${numbers[8]}`,
              align: "center",
            },
            {
              type: "filler",
            },
          ],
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: `${numbers[2]}`,
              align: "center",
            },
            {
              type: "text",
              text: `${numbers[7]}`,
              align: "center",
            },
          ],
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: `${numbers[3]}`,
              align: "center",
            },
            {
              type: "text",
              text: `${numbers[4]}`,
              align: "center",
            },
            {
              type: "text",
              text: `${numbers[5]}`,
              align: "center",
            },
            {
              type: "text",
              text: `${numbers[6]}`,
              align: "center",
            },
          ],
        },
      ],
    },
  };
};

/**
 * 產出北斗七星解謎`flex`
 * @param {Array} numbers 解謎結果陣列
 */
exports.genSevenStarBubble = numbers => {
  return {
    type: "bubble",
    size: "nano",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `${numbers[0]}`,
          position: "absolute",
          offsetStart: "20%",
          offsetTop: "10%",
        },
        {
          type: "text",
          text: `${numbers[1]}`,
          position: "absolute",
          offsetEnd: "20%",
          offsetTop: "10%",
        },
        {
          type: "text",
          text: `${numbers[2]}`,
          offsetEnd: "20%",
          position: "absolute",
          offsetTop: "30%",
        },
        {
          type: "text",
          text: `${numbers[3]}`,
          position: "absolute",
          offsetTop: "30%",
          offsetStart: "19%",
        },
        {
          type: "text",
          text: `${numbers[4]}`,
          position: "absolute",
          offsetStart: "20%",
          offsetTop: "50%",
        },
        {
          type: "text",
          text: `${numbers[5]}`,
          position: "absolute",
          offsetTop: "70%",
          offsetStart: "30%",
        },
        {
          type: "text",
          text: `${numbers[6]}`,
          position: "absolute",
          offsetEnd: "25%",
          offsetBottom: "10%",
        },
      ],
      height: "200px",
    },
  };
};

exports.genSeverStarManual = () => {
  return {
    type: "bubble",
    size: "nano",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "使用說明",
          weight: "bold",
        },
        {
          type: "text",
          text: "右下為起點",
          size: "sm",
        },
        {
          type: "text",
          text: "左上為終點",
          size: "sm",
        },
        {
          type: "text",
          text: "照著順序進行開關即可",
          size: "sm",
          wrap: true,
        },
      ],
      spacing: "sm",
    },
  };
};
