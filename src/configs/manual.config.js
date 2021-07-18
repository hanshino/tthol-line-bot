module.exports = [
  {
    regex: /^副本解謎$/,
    send: [
      "我提供了三個副本的解謎功能，請選擇要使用的副本並輸入以下指令",
      "- 160迷霧九宮格解謎，請輸入：160",
      "- 175北斗七星解謎，請輸入：175",
      "- 180神武禁地解謎，請輸入：180",
    ].join("\n"),
  },
  { regex: /^160$/, send: "160九宮格解謎，範例：160 15 魁3 寶6" },
  { regex: /^175$/, send: "175副本隱藏王機關解謎指令\n使用方式：175 謎底數字\n範例：175 35" },
  { regex: /^180$/, send: "使用方式：180 總和 缺口" },
  { regex: /^\.?(item|物品)$/, send: "使用方式：物品 發芽嫩草" },
  { regex: /^\.?(monster|怪物)$/, send: "使用方式：怪物 泡泡海馬" },
  {
    regex: /^\.?(skill|技能)$/,
    send: [
      "使用方式：指令與參數之間，記得加空格",
      "- 知道名稱 > 技能 幽冥刺擊",
      "- 部分搜尋 > 技能 神 雷",
      "- 進階技能 > 進階書",
    ].join("\n"),
  },
  {
    regex: /^\.?(equip|裝備)$/,
    send: [
      "使用方式：指令與參數之間，記得加空格",
      "- 知道名稱 > 裝備 極品山豬頭",
      "- 部分搜尋 > 裝備 極 貝",
      "- 坐騎搜尋，輸入：坐騎",
      "- 背飾搜尋，輸入：背飾",
    ].join("\n"),
  },
  {
    regex: /^\.?(driver|[坐座]騎?)$/,
    send: [
      "使用方式：指令與參數之間，記得加空格",
      "- 知道名稱 > 座騎 奔向幸福",
      "- 部分搜尋 > 座騎 奔 福",
      "- 屬性篩選 > 座騎 外 命",
      "- 屬性篩選 > 座騎 外10 技10",
      "- 坐騎比較 > 座騎比較 一心 白鯨",
      "- 排行計算 > 座騎排行 移動 身*7 外*7 重*5",
      "- 使用預設公式 > 外功座騎 = 坐騎 外*11 物 技*3 命 防 護",
    ].join("\n"),
  },
  {
    regex: /^\.?(back|背[部|飾]?)$/,
    send: [
      "使用方式：指令與參數之間，記得加空格",
      "- 知道名稱 > 背飾 靈蝠迴翼",
      "- 部分搜尋 > 背飾 靈 翼",
      "- 屬性篩選 > 背飾 身 閃 重",
      "- 屬性篩選 > 背飾 身10 閃10 重5",
      "- 背飾比較 > 背飾比較 炸彈 蒼瀾",
      "- 排行計算 > 背飾排行 移動 身*7 外*7 重*5",
      "- 使用預設公式 > 外功背飾 = 背飾 外*11 物 技*3 命 防 護",
    ].join("\n"),
  },
];
