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

function godNumberCell(number, leaked) {
  return {
    type: "box",
    layout: "vertical",
    width: "44px",
    height: "44px",
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: leaked ? COLORS.primary : COLORS.card,
    borderColor: leaked ? COLORS.primary : COLORS.border,
    borderWidth: "1px",
    cornerRadius: "8px",
    contents: [
      {
        type: "text",
        text: `${number}`,
        color: leaked ? COLORS.card : COLORS.ink,
        size: "xl",
        weight: "bold",
        align: "center",
      },
    ],
  };
}

function godSpacer() {
  return {
    type: "box",
    layout: "vertical",
    width: "44px",
    height: "44px",
    flex: 0,
    contents: [],
  };
}

function godRow(contents) {
  return {
    type: "box",
    layout: "horizontal",
    spacing: "5px",
    justifyContent: "center",
    contents,
  };
}

/**
 * 產出神武禁地解謎`flex`
 * @param {Array} numbers 解謎結果陣列
 */
exports.genGodQuestBubble = numbers => ({
  type: "bubble",
  size: "micro",
  body: {
    type: "box",
    layout: "vertical",
    paddingAll: "0px",
    contents: [
      {
        type: "box",
        layout: "vertical",
        backgroundColor: COLORS.primary,
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingStart: "14px",
        paddingEnd: "14px",
        contents: [
          {
            type: "text",
            text: "神武禁地",
            color: COLORS.card,
            size: "sm",
            weight: "bold",
          },
          {
            type: "text",
            text: "紅色格為已知數字",
            color: COLORS.card,
            size: "xxs",
            margin: "xs",
          },
        ],
      },
      {
        type: "box",
        layout: "vertical",
        backgroundColor: COLORS.background,
        paddingTop: "12px",
        paddingBottom: "14px",
        paddingStart: "8px",
        paddingEnd: "8px",
        spacing: "5px",
        contents: [
          godRow([godNumberCell(numbers[0])]),
          godRow([
            godSpacer(),
            godNumberCell(numbers[1], true),
            godNumberCell(numbers[8]),
            godSpacer(),
          ]),
          godRow([godNumberCell(numbers[2]), godSpacer(), godSpacer(), godNumberCell(numbers[7])]),
          godRow([
            godNumberCell(numbers[3]),
            godNumberCell(numbers[4]),
            godNumberCell(numbers[5]),
            godNumberCell(numbers[6]),
          ]),
        ],
      },
    ],
  },
});

function sevenStarPill(value, position) {
  const isOpen = value === "開";
  return {
    type: "box",
    layout: "vertical",
    position: "absolute",
    ...position,
    backgroundColor: isOpen ? COLORS.indigo : COLORS.muted,
    cornerRadius: "12px",
    paddingTop: "3px",
    paddingBottom: "3px",
    paddingStart: "8px",
    paddingEnd: "8px",
    contents: [
      {
        type: "text",
        text: isOpen ? `• ${value}` : value,
        color: isOpen ? COLORS.card : COLORS.border,
        size: "xs",
        weight: isOpen ? "bold" : "regular",
        align: "center",
      },
    ],
  };
}

/**
 * 產出北斗七星解謎`flex`
 * @param {Array} numbers 解謎結果陣列
 */
exports.genSevenStarBubble = numbers => ({
  type: "bubble",
  size: "nano",
  body: {
    type: "box",
    layout: "vertical",
    height: "200px",
    backgroundColor: COLORS.ink,
    paddingTop: "8px",
    paddingBottom: "6px",
    paddingStart: "8px",
    paddingEnd: "8px",
    contents: [
      {
        type: "text",
        text: "✦ 北斗七星",
        color: COLORS.border,
        size: "xxs",
        weight: "bold",
      },
      sevenStarPill(numbers[0], { offsetStart: "20%", offsetTop: "10%" }),
      sevenStarPill(numbers[1], { offsetEnd: "20%", offsetTop: "10%" }),
      sevenStarPill(numbers[2], { offsetEnd: "20%", offsetTop: "30%" }),
      sevenStarPill(numbers[3], { offsetTop: "30%", offsetStart: "19%" }),
      sevenStarPill(numbers[4], { offsetStart: "20%", offsetTop: "50%" }),
      sevenStarPill(numbers[5], { offsetTop: "70%", offsetStart: "30%" }),
      sevenStarPill(numbers[6], { offsetEnd: "25%", offsetBottom: "10%" }),
    ],
  },
});

function manualStep(number, text) {
  return {
    type: "box",
    layout: "horizontal",
    alignItems: "center",
    spacing: "sm",
    backgroundColor: COLORS.background,
    cornerRadius: "6px",
    paddingTop: "6px",
    paddingBottom: "6px",
    paddingStart: "8px",
    paddingEnd: "8px",
    contents: [
      { type: "text", text: number, color: COLORS.primary, size: "xs", weight: "bold", flex: 0 },
      { type: "text", text, color: COLORS.ink, size: "xs", wrap: true, flex: 1 },
    ],
  };
}

exports.genSeverStarManual = () => ({
  type: "bubble",
  size: "nano",
  body: {
    type: "box",
    layout: "vertical",
    backgroundColor: COLORS.card,
    paddingAll: "0px",
    contents: [
      {
        type: "box",
        layout: "horizontal",
        alignItems: "center",
        paddingTop: "10px",
        paddingBottom: "8px",
        paddingStart: "12px",
        paddingEnd: "12px",
        contents: [
          {
            type: "box",
            layout: "vertical",
            width: "3px",
            height: "14px",
            backgroundColor: COLORS.primary,
            cornerRadius: "2px",
            contents: [],
          },
          {
            type: "text",
            text: "使用說明",
            color: COLORS.ink,
            size: "sm",
            weight: "bold",
            margin: "md",
          },
        ],
      },
      {
        type: "box",
        layout: "vertical",
        paddingStart: "12px",
        paddingEnd: "12px",
        paddingBottom: "12px",
        spacing: "5px",
        contents: [
          manualStep("①", "右下為起點"),
          manualStep("②", "左上為終點"),
          manualStep("③", "照著順序進行開關即可"),
        ],
      },
    ],
  },
});
