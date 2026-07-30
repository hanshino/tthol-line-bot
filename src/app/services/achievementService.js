const achievementRepo = require("../repositories/achievementRepository");

exports.getCategories = () => achievementRepo.getCategories();
exports.getBySubCat = subCatId => achievementRepo.getBySubCat(subCatId);
exports.searchByKeyword = keyword => achievementRepo.searchByKeyword(keyword);
exports.findCategoryByName = name => achievementRepo.findCategoryByName(name);
exports.findSubCatByName = (categoryId, name) => achievementRepo.findSubCatByName(categoryId, name);

exports.formatReward = row => {
  const amount = Number(row.rewardAmount) || 0;
  const id = row.rewardId;
  const itemName = row.rewardItemName || `#${id}`;
  const magicName = row.rewardMagicName || `#${id}`;
  let rewardLabel = null;
  let rewardAction = null;
  switch (Number(row.rewardType)) {
    case 0:
      break;
    case 1:
      rewardLabel = `貨幣 #${id} ×${amount.toLocaleString()}`;
      break;
    case 2:
      rewardLabel = `${itemName} ×${amount.toLocaleString()}`;
      rewardAction = `.item ${id}`;
      break;
    case 3:
      rewardLabel = `銀兩 ×${amount.toLocaleString()}`;
      break;
    case 5:
      rewardLabel = amount > 1 ? `${magicName} ×${amount}` : magicName;
      rewardAction = `.skill ${id} 1`;
      break;
    default:
      rewardLabel = `獎勵 #${row.rewardType}（#${id} ×${amount}）`;
  }
  return {
    name: row.name,
    description: row.description,
    points: row.points,
    resetType: row.resetType,
    rewardLabel,
    rewardAction,
  };
};
