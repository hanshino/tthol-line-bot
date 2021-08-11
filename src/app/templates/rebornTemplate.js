/**
 * 舊轉材選單
 */
exports.genOldRebornBubble = () => ({
  type: "bubble",
  header: {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: "轉生材料(舊)",
        size: "lg",
        align: "center",
      },
    ],
  },
  hero: {
    type: "image",
    url: "https://i.imgur.com/jBH944q.jpg",
    size: "full",
    aspectRatio: "16:9",
    aspectMode: "cover",
  },
  body: {
    type: "box",
    layout: "vertical",
    spacing: "md",
    contents: [
      {
        type: "text",
        text: "取得方式可以點選轉材",
        size: "lg",
        align: "center",
        weight: "bold",
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/IhaulYa.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "奇幻天書",
                gravity: "center",
                align: "center",
                size: "sm",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 奇幻天書",
            },
            paddingAll: "3px",
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/wZT4znX.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "斷腸草",
                gravity: "center",
                align: "center",
                size: "sm",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 斷腸草",
            },
            paddingAll: "3px",
          },
        ],
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/0lHlW3O.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "轉命散",
                gravity: "center",
                align: "center",
                size: "sm",
              },
            ],
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/MzvQ0ex.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "回魂珠",
                gravity: "center",
                align: "center",
                size: "sm",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 回魂珠",
            },
            paddingAll: "3px",
          },
        ],
        action: {
          type: "message",
          label: "action",
          text: "物品 轉命散",
        },
        paddingAll: "3px",
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "image",
            url: "https://i.imgur.com/Sg5TTOS.jpg",
            size: "xxs",
          },
          {
            type: "text",
            text: "慈悲心",
            gravity: "center",
            align: "center",
            size: "sm",
          },
        ],
        action: {
          type: "message",
          label: "action",
          text: "物品 慈悲心",
        },
        paddingAll: "3px",
      },
    ],
  },
});

/**
 * 新轉材選單
 */
exports.genNewRebornBubble = () => ({
  type: "bubble",
  header: {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: "轉生材料(新)",
        size: "lg",
        align: "center",
        weight: "bold",
      },
    ],
  },
  hero: {
    type: "image",
    url: "https://i.imgur.com/v23FA2J.jpg",
    size: "full",
    aspectRatio: "4:3",
    aspectMode: "cover",
  },
  body: {
    type: "box",
    layout: "vertical",
    spacing: "md",
    contents: [
      {
        type: "text",
        text: "取得方式可以點選轉材",
        size: "lg",
        align: "center",
        weight: "bold",
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/F43GEhY.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "黃泉晶魄",
                size: "xs",
                gravity: "center",
                align: "center",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 黃泉晶魄",
            },
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/B2YOrnS.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "淬魂靈泉",
                size: "xs",
                gravity: "center",
                align: "center",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 淬魂靈泉",
            },
          },
        ],
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/h1ecrgR.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "琉璃瓶",
                size: "xs",
                gravity: "center",
                align: "center",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 琉璃瓶",
            },
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/yXZn35F.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "平等盆",
                size: "xs",
                gravity: "center",
                align: "center",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 平等盆",
            },
          },
        ],
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/kQYscZL.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "玄冰玉膏",
                size: "xs",
                gravity: "center",
                align: "center",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 玄冰玉膏",
            },
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/cJnjCty.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "和氣湯",
                size: "xs",
                gravity: "center",
                align: "center",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 和氣湯",
            },
          },
        ],
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/gnk670f.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "邪幻玉髓",
                size: "xs",
                gravity: "center",
                align: "center",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 邪幻玉髓",
            },
          },
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/9j2k8Iw.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "日月精元",
                size: "xs",
                gravity: "center",
                align: "center",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 日月精元",
            },
          },
        ],
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://i.imgur.com/0lHlW3O.jpg",
                size: "xxs",
              },
              {
                type: "text",
                text: "寬心鍋",
                size: "xs",
                gravity: "center",
                align: "center",
              },
            ],
            action: {
              type: "message",
              label: "action",
              text: "物品 寬心鍋",
            },
          },
        ],
      },
    ],
  },
});

/**
 * 轉生解說
 */
exports.genRebornBubble = () => ({
  type: "bubble",
  header: {
    type: "box",
    layout: "vertical",
    contents: [
      {
        type: "text",
        text: "關於武林轉生這回事",
        align: "center",
        wrap: true,
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
            text: "轉生是什麼",
            flex: 2,
            gravity: "center",
          },
          {
            type: "text",
            text: "解：角色到達100等可進行轉生任務，回歸1等，經驗將會得到加成，轉生的等會有不同的初始屬性獎勵。",
            wrap: true,
            size: "sm",
            flex: 3,
          },
        ],
        paddingAll: "3px",
      },
      {
        type: "separator",
      },
      {
        type: "box",
        layout: "horizontal",
        action: {
          type: "uri",
          uri: "https://forum.gamer.com.tw/G2.php?bsn=06960&parent=3468&sn=3472&lorder=5&ptitle=%E8%BD%89%E7%94%9F",
        },
        contents: [
          {
            type: "text",
            text: "經驗加成怎算",
            flex: 4,
            gravity: "center",
          },
          {
            type: "box",
            layout: "vertical",
            flex: 3,
            contents: [
              {
                type: "text",
                text: "一轉",
                size: "sm",
              },
              {
                type: "text",
                text: "二轉",
                size: "sm",
              },
              {
                type: "text",
                text: "三轉",
                size: "sm",
              },
              {
                type: "text",
                text: "四轉",
                size: "sm",
              },
            ],
          },
          {
            type: "box",
            layout: "vertical",
            flex: 3,
            contents: [
              {
                type: "text",
                text: "1.5倍",
                size: "sm",
              },
              {
                type: "text",
                text: "2.0倍",
                size: "sm",
              },
              {
                type: "text",
                text: "3.0倍",
                size: "sm",
              },
              {
                type: "text",
                text: "3.2倍",
                size: "sm",
              },
            ],
          },
        ],
        paddingAll: "3px",
      },
      {
        type: "separator",
      },
      {
        type: "box",
        layout: "horizontal",
        action: {
          type: "uri",
          uri: "https://forum.gamer.com.tw/G2.php?bsn=06960&parent=3468&sn=3472&lorder=5&ptitle=%E8%BD%89%E7%94%9F",
        },
        contents: [
          {
            type: "text",
            text: "屬性獎勵怎算",
            gravity: "center",
            flex: 2,
          },
          {
            type: "button",
            action: {
              type: "uri",
              uri: "https://forum.gamer.com.tw/G2.php?bsn=06960&parent=3468&sn=3482&lorder=4&ptitle=%E8%BD%89%E7%94%9F",
              label: "點我看詳細",
            },
            flex: 3,
          },
        ],
        paddingAll: "3px",
      },
      {
        type: "separator",
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "text",
            text: "轉材是什麼",
            gravity: "center",
            flex: 2,
          },
          {
            type: "text",
            text: "每次轉生都需進行轉生任務，點選下面可得知轉生材料，1~3為舊轉，4為新轉",
            wrap: true,
            size: "sm",
            flex: 3,
          },
        ],
        paddingAll: "3px",
      },
    ],
  },
  footer: {
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "button",
        action: {
          type: "message",
          label: "舊轉生材料",
          text: "舊轉",
        },
      },
      {
        type: "button",
        action: {
          type: "message",
          label: "新轉生材料",
          text: "新轉",
        },
      },
    ],
  },
});
