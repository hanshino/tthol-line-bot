const achievement = require("../models/achievement");
const achievementCategory = require("../models/achievementCategory");
const achievementSubCat = require("../models/achievementSubCat");
const knex = require("../models/model");

const rewardNames = [
  knex.raw(
    "(SELECT name FROM items WHERE items.id = achievements.reward_id LIMIT 1) AS rewardItemName"
  ),
  knex.raw(
    "(SELECT name FROM magic WHERE magic.id = achievements.reward_id ORDER BY level ASC LIMIT 1) AS rewardMagicName"
  ),
];

function achievementQuery() {
  return achievement()
    .select(
      "achievements.*",
      "achievements.reward_type as rewardType",
      "achievements.reward_id as rewardId",
      "achievements.reward_amount as rewardAmount",
      "achievements.reset_type as resetType",
      "achievement_categories.name as categoryName",
      "achievement_sub_cats.name as subCatName",
      rewardNames[0],
      rewardNames[1]
    )
    .join("achievement_sub_cats", "achievement_sub_cats.id", "achievements.sub_cat_id")
    .join(
      "achievement_categories",
      "achievement_categories.id",
      "achievement_sub_cats.category_id"
    );
}

exports.getCategories = async () => {
  const rows = await achievementCategory()
    .select(
      "achievement_categories.id as categoryId",
      "achievement_categories.name as categoryName",
      "achievement_categories.sort_order as categorySortOrder",
      "achievement_sub_cats.id as subCatId",
      "achievement_sub_cats.name as subCatName",
      "achievement_sub_cats.sort_order as subCatSortOrder"
    )
    .count("achievements.id as count")
    .sum("achievements.points as totalPoints")
    .leftJoin(
      "achievement_sub_cats",
      "achievement_sub_cats.category_id",
      "achievement_categories.id"
    )
    .leftJoin("achievements", "achievements.sub_cat_id", "achievement_sub_cats.id")
    .groupBy(
      "achievement_categories.id",
      "achievement_categories.name",
      "achievement_categories.sort_order",
      "achievement_sub_cats.id",
      "achievement_sub_cats.name",
      "achievement_sub_cats.sort_order"
    )
    .orderBy("categorySortOrder")
    .orderBy("subCatSortOrder");

  const categories = [];
  rows.forEach(row => {
    let category = categories.find(item => item.id === row.categoryId);
    if (!category) {
      category = { id: row.categoryId, name: row.categoryName, subCats: [] };
      categories.push(category);
    }
    if (row.subCatId !== null) {
      category.subCats.push({
        id: row.subCatId,
        name: row.subCatName,
        count: Number(row.count) || 0,
        totalPoints: Number(row.totalPoints) || 0,
      });
    }
  });
  return categories;
};

exports.getBySubCat = subCatId =>
  achievementQuery()
    .where("achievements.sub_cat_id", subCatId)
    .orderBy([
      { column: "achievements.group_no", order: "asc" },
      { column: "achievements.id", order: "asc" },
    ]);

exports.searchByKeyword = keyword =>
  achievementQuery()
    .where(function () {
      this.where("achievements.name", "like", `%${keyword}%`).orWhere(
        "achievements.description",
        "like",
        `%${keyword}%`
      );
    })
    .orderBy("achievements.group_no", "asc")
    .orderBy("achievements.id", "asc")
    .limit(100);

exports.findCategoryByName = name => achievementCategory().where("name", name).first();

exports.findSubCatByName = (categoryId, name) =>
  achievementSubCat().where({ category_id: categoryId, name }).first();
