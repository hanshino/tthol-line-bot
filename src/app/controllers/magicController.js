const { Context } = require("bottender");
const { text } = require("bottender/router");
const magicService = require("../services/magicService");
const i18n = require("../../utils/i18n");
const magicTemplate = require("../templates/magicTemplate");
let skillRegex = /^.(skill|技能)\s(?<id>\d+)(\s(?<level>\d+))?/;
const skipKeys = [
  "teacher",
  "recharge_effect",
  "skill_type",
  "icon",
  "clan",
  "clan2",
  "id",
  "cast_effect",
  "target",
  "level",
];
exports.routes = [text(skillRegex, showSkill), text(/^\.?(skill|技能)\s/, searchSkill)];

/**
 * 技能搜尋
 * @param {Context} context
 * @param {import("bottender").Props} props
 */
async function searchSkill(context, props) {
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

  let texts = magics.map(data =>
    magicTemplate.genSelectText({ text: `${data.name}`, id: data.id, level: data.level })
  );
  let selectRows = [];

  for (let i = 0; i < texts.length; i += 2) {
    selectRows.push(magicTemplate.genSelectRow(texts.slice(i, i + 2)));
  }

  context.replyFlex(`${params.join("+")} 的查詢結果`, magicTemplate.genSearchBubble(selectRows));
}

async function showSkill(context, props) {
  const { id, level } = props.match.groups;
  const magic = await magicService.find(id, level);

  if (!magic) {
    return context.replyText(i18n.__("not_found"));
  }

  let rows = Object.keys(magic)
    .filter(key => magic[key] && !skipKeys.includes(key))
    .map(key => magicTemplate.genAttributeRow(i18n.__("magic." + key), magic[key]));

  let bubbles = [magicTemplate.genMagicBubble(magic.name, magic.level, rows)];
  let max = await magicService.getMaxLevelById(id);

  // 選擇列表文字鈕
  let texts = Array.from({ length: max.level || magic.level }).map((_, index) =>
    magicTemplate.genSelectText({ id: magic.id, level: index + 1, text: `Lv. ${index + 1}` })
  );

  let selectRows = [];
  for (let i = 0; i < texts.length; i += 4) {
    selectRows.push(magicTemplate.genSelectRow(texts.slice(i, i + 4)));
  }

  bubbles.push(magicTemplate.genSelectBubble(selectRows));

  context.replyFlex(`${magic.name} 的資訊`, { type: "carousel", contents: bubbles });
}
