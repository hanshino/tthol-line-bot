const { text } = require("bottender/router");
const achievementService = require("../services/achievementService");
const achievementTemplate = require("../templates/achievementTemplate");

exports.routes = [text(/^\.?成就(?:\s+(?<rest>.+))?$/, searchAchievement)];

async function searchAchievement(context, props) {
  const rest = props.match.groups.rest;
  const categories = await achievementService.getCategories();
  if (!rest) {
    return context.replyFlex("成就分類", achievementTemplate.genCategoryBubble(categories));
  }

  const category = await achievementService.findCategoryByName(rest);
  if (category) {
    const data = categories.find(item => item.id === category.id);
    return context.replyFlex(
      category.name,
      achievementTemplate.genSubCatBubble(category.name, data ? data.subCats : [])
    );
  }

  const match = categories
    .filter(item => rest.indexOf(item.name + " ") === 0)
    .sort((a, b) => b.name.length - a.name.length)[0];
  if (match) {
    const subCatName = rest.slice(match.name.length + 1);
    const subCat = await achievementService.findSubCatByName(match.id, subCatName);
    if (subCat) {
      return showRows(
        context,
        `${match.name} - ${subCat.name}`,
        await achievementService.getBySubCat(subCat.id)
      );
    }
  }

  const rows = await achievementService.searchByKeyword(rest);
  if (rows.length === 0) {
    return context.replyText("查無相對應的成就，建議只搜尋確認的字");
  }
  return showRows(context, "成就搜尋：" + rest, rows);
}

async function showRows(context, title, achievements) {
  const rows = achievements.map(item =>
    achievementTemplate.genAchievementRow(achievementService.formatReward(item))
  );
  const bubbles = [];
  for (let i = 0; i < rows.length; i += 10) {
    bubbles.push(achievementTemplate.genAchievementBubble(title, rows.slice(i, i + 10)));
  }
  context.replyFlex(title, { type: "carousel", contents: bubbles.slice(0, 12) });
  if (bubbles.length > 12) {
    context.replyText("還有剩餘結果未顯示，請縮小範圍");
  }
}
