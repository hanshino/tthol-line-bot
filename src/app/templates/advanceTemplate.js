exports.genSkillBox = name => {
  return {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: `${name}`,
        wrap: true,
        align: "center",
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "技能資訊",
                align: "center",
                size: "sm",
              },
            ],
            borderWidth: "normal",
            borderColor: "#421551",
            cornerRadius: "md",
            action: { type: "message", text: `.skill ${name}` },
          },
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "1級資訊",
                align: "center",
                size: "sm",
              },
            ],
            borderWidth: "normal",
            borderColor: "#421551",
            cornerRadius: "md",
            action: { type: "message", text: `.item 1級${name}` },
          },
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "11級資訊",
                align: "center",
                size: "sm",
              },
            ],
            borderWidth: "normal",
            borderColor: "#421551",
            cornerRadius: "md",
            action: { type: "message", text: `.item 11級${name}` },
          },
        ],
        spacing: "md",
        paddingAll: "md",
      },
    ],
  };
};

exports.genAdvancedBubble = (title, boxs) => {
  return {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `${title}`,
          weight: "bold",
          align: "center",
        },
      ],
      paddingBottom: "3px",
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: boxs,
    },
  };
};
