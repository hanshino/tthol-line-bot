const { text } = require("bottender/router");
const magicService = require("../services/magicService");
const i18n = require("../../utils/i18n");
const magicTemplate = require("../templates/magicTemplate");
let skillRegex = /^.(skill|技能)\s(?<id>\d+)(\s(?<level>\d+))?/;
// 數值參數只挑這幾個乾淨欄位（比照 mockup），避免 break_prob/group/order/status_prob 等
// 內部除錯欄位（locale 裡沒有真中文翻譯，只是把英文欄名原樣複製一份）混進來顯示。
const STAT_KEYS = ["range", "spend_mp", "stun", "time", "func_dmg", "func_hit"];
exports.routes = [text(skillRegex, showSkill), text(/^\.?(skill|技能)\s/, searchSkill)];

/**
 * 技能搜尋
 * @param {import("bottender").LineContext} context
 */
async function searchSkill(context) {
  const params = context.event.message.text.split(/\s+/g);
  params.shift();

  const magics = await magicService.searchByName(params, true);

  if (magics.length === 1) {
    let [target] = magics;
    let { groups } = `.skill ${target.id}`.match(skillRegex);

    return showSkill(context, {
      match: { groups },
    });
  }

  if (magics.length === 0) {
    return context.replyText(
      `您搜尋的：${params.join("+")}\n查無此技能，建議只針對確定的關鍵字搜尋，例如：幻 甲 靈`
    );
  }

  context.replyFlex(
    `${params.join("+")} 的查詢結果`,
    magicTemplate.genSearchBubble(params.join("+"), magics)
  );
}

async function showSkill(context, props) {
  const { id, level } = props.match.groups;
  const magic = await magicService.find(id, level);

  if (!magic) {
    return context.replyText(i18n.__("not_found"));
  }

  const basicKeys = ["name", "level", "clan", "target", "pk_disable"];
  const basicRows = basicKeys
    .filter(key => magic[key] !== undefined && magic[key] !== null && magic[key] !== "")
    .map(key =>
      magicTemplate.genAttributeRow(
        i18n.__("magic." + key),
        key === "clan"
          ? `${magicTemplate.clanZh(magic.clan)}${magic.clan2 && magic.clan2 !== magic.clan ? `、${magicTemplate.clanZh(magic.clan2)}` : ""}`
          : key === "target"
            ? magicTemplate.targetZh(magic[key])
            : key === "pk_disable"
              ? magic[key]
                ? "是"
                : "否"
              : magic[key],
        key === "pk_disable" && magic[key] ? "#b6322d" : undefined
      )
    );
  const statRows = STAT_KEYS.filter(key => magic[key] !== undefined && magic[key] !== null).map(
    key =>
      magicTemplate.genAttributeRow(
        i18n.__("magic." + key),
        magic[key],
        magicTemplate.valueColor(key)
      )
  );
  let bubbles = [magicTemplate.genMagicBubble(magic, basicRows, statRows)];
  let max = await magicService.getMaxLevelById(id);

  // 選擇列表文字鈕
  bubbles.push(
    magicTemplate.genSelectBubble(magic.name, magic.id, max.level || magic.level, magic.level)
  );

  context.replyFlex(`${magic.name} 的資訊`, { type: "carousel", contents: bubbles });
}
