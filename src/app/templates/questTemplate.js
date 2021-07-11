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
