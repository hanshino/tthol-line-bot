exports.genContactMe = () => ({
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
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "image",
                    url: "https://cdn.discordapp.com/attachments/836877376583499796/865889489762385941/image0.jpg",
                    aspectMode: "cover",
                    size: "full",
                  },
                ],
                cornerRadius: "100px",
                borderColor: "#00000080",
                borderWidth: "medium",
              },
              {
                type: "text",
                text: "阿克婭",
                size: "xs",
                weight: "bold",
                margin: "sm",
                align: "center",
              },
              {
                type: "text",
                contents: [
                  {
                    type: "span",
                    text: "小幫手作者",
                  },
                  {
                    type: "span",
                    text: "\n",
                  },
                  {
                    type: "span",
                    text: "巴哈版主",
                  },
                ],
                size: "xxs",
                margin: "sm",
                color: "#808080",
                align: "center",
                wrap: true,
              },
            ],
            width: "72px",
            height: "130px",
          },
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                contents: [
                  {
                    type: "span",
                    text: "花無缺",
                    weight: "bold",
                    color: "#808080",
                  },
                  {
                    type: "span",
                    text: "\n",
                  },
                  {
                    type: "span",
                    text: "哈囉，追著童年回憶的同時，有幸在此能使用個人專長與興趣提供工具為各位服務，此為非官方工具，有使用相關問題可與我聯繫，若是孤單寂寞冷本人不陪聊，謝謝。",
                    size: "xs",
                  },
                ],
                size: "sm",
                wrap: true,
              },
            ],
          },
        ],
        spacing: "xl",
        paddingAll: "20px",
        paddingBottom: "5px",
      },
      {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "box",
            layout: "baseline",
            contents: [
              {
                type: "icon",
                url: "https://forum.gamer.com.tw/favicon.ico",
                size: "sm",
                margin: "xs",
                offsetTop: "xs",
              },
              {
                type: "text",
                contents: [
                  {
                    type: "span",
                    text: "我的小屋",
                  },
                ],
                size: "xs",
                margin: "sm",
              },
            ],
            paddingAll: "3px",
            borderColor: "#324821",
            borderWidth: "1px",
            cornerRadius: "sm",
            action: {
              type: "uri",
              label: "action",
              uri: "https://home.gamer.com.tw/homeindex.php?owner=jane58821",
            },
          },
          {
            type: "box",
            layout: "baseline",
            contents: [
              {
                type: "icon",
                url: "https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico",
                size: "sm",
                margin: "xs",
                offsetTop: "xs",
              },
              {
                type: "text",
                contents: [
                  {
                    type: "span",
                    text: "Discord",
                  },
                ],
                size: "xs",
                margin: "sm",
              },
            ],
            paddingAll: "3px",
            borderColor: "#324821",
            borderWidth: "1px",
            cornerRadius: "sm",
            action: {
              type: "uri",
              label: "action",
              uri: "https://discord.gg/K2Sj8HEFab",
            },
          },
          {
            type: "box",
            layout: "baseline",
            contents: [
              {
                type: "icon",
                url: "https://github.githubassets.com/favicons/favicon.png",
                size: "sm",
                margin: "xs",
                offsetTop: "xs",
              },
              {
                type: "text",
                contents: [
                  {
                    type: "span",
                    text: "原始碼",
                  },
                ],
                size: "xs",
                margin: "sm",
              },
            ],
            paddingAll: "3px",
            borderColor: "#324821",
            borderWidth: "1px",
            cornerRadius: "sm",
            action: {
              type: "uri",
              label: "action",
              uri: "https://github.com/hanshino/tthol-line-bot",
            },
          },
        ],
        paddingAll: "10px",
        spacing: "md",
      },
    ],
    paddingAll: "0px",
  },
});
