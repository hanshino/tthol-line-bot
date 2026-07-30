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

function actionChip(text, action, lead) {
  return {
    type: "box",
    layout: "vertical",
    flex: 1,
    paddingTop: "7px",
    paddingBottom: "7px",
    cornerRadius: "9px",
    backgroundColor: lead ? COLORS.card : COLORS.background,
    borderColor: lead ? "#ddd2e0" : COLORS.border,
    borderWidth: "1px",
    action: { type: "message", text: action },
    contents: [
      {
        type: "text",
        text,
        color: lead ? COLORS.plum : COLORS.muted,
        size: "xs",
        weight: "bold",
        align: "center",
      },
    ],
  };
}

exports.genSkillBox = name => ({
  type: "box",
  layout: "vertical",
  backgroundColor: COLORS.card,
  borderColor: COLORS.border,
  borderWidth: "1px",
  cornerRadius: "11px",
  paddingAll: "11px",
  contents: [
    {
      type: "box",
      layout: "horizontal",
      alignItems: "center",
      margin: "md",
      contents: [
        {
          type: "box",
          layout: "vertical",
          width: "3px",
          height: "14px",
          backgroundColor: COLORS.plum,
          cornerRadius: "2px",
          contents: [],
        },
        {
          type: "box",
          layout: "vertical",
          width: "24px",
          height: "24px",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#eee4f0",
          cornerRadius: "7px",
          contents: [
            {
              type: "text",
              text: `${name}`.charAt(0),
              color: COLORS.plum,
              size: "xs",
              weight: "bold",
            },
          ],
        },
        {
          type: "text",
          text: `${name}`,
          color: COLORS.ink,
          size: "sm",
          weight: "bold",
          wrap: true,
          margin: "sm",
        },
      ],
    },
    {
      type: "box",
      layout: "horizontal",
      spacing: "sm",
      contents: [
        actionChip("技能資訊", `.skill ${name}`, true),
        actionChip("1級", `.item 1級${name}`),
        actionChip("11級", `.item 11級${name}`),
      ],
    },
  ],
});

exports.genAdvancedBubble = (title, boxes) => ({
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
        paddingStart: "15px",
        paddingEnd: "15px",
        contents: [
          {
            type: "text",
            text: `${title}`,
            color: COLORS.card,
            size: "lg",
            weight: "bold",
            wrap: true,
          },
        ],
      },
      {
        type: "box",
        layout: "vertical",
        paddingAll: "15px",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            alignItems: "center",
            margin: "md",
            contents: [
              {
                type: "box",
                layout: "vertical",
                width: "3px",
                height: "14px",
                backgroundColor: COLORS.plum,
                cornerRadius: "2px",
                contents: [],
              },
              {
                type: "text",
                text: "技能書",
                color: COLORS.ink,
                size: "sm",
                weight: "bold",
                margin: "md",
              },
            ],
          },
          ...boxes,
        ],
      },
    ],
  },
});
