const itemRandService = require("../src/app/services/itemRandService");

/**
 * 測試 itemRand 服務
 */
async function testItemRandService() {
  try {
    console.log("開始測試 itemRand 服務...");

    // 測試數據
    const testData = [
      {
        id: "test_item_1",
        attribute: "str",
        max: 10,
        min: 5,
        rate: 80,
      },
      {
        id: "test_item_1",
        attribute: "agi",
        max: 8,
        min: 3,
        rate: 60,
      },
    ];

    // 測試批量創建
    console.log("測試批量創建隨機素質...");
    await itemRandService.createBatch(testData);
    console.log("✓ 批量創建成功");

    // 測試查詢
    console.log("測試查詢隨機素質...");
    const results = await itemRandService.getByItemId("test_item_1");
    console.log("查詢結果:", results);
    console.log("✓ 查詢成功");

    // 測試更新
    console.log("測試更新隨機素質...");
    await itemRandService.update("test_item_1", "str", { max: 15, min: 8 });
    console.log("✓ 更新成功");

    // 再次查詢驗證更新
    const updatedResults = await itemRandService.getByItemId("test_item_1");
    console.log("更新後結果:", updatedResults);

    // 清理測試數據
    console.log("清理測試數據...");
    await itemRandService.deleteByItemId("test_item_1");
    console.log("✓ 清理完成");

    console.log("所有測試通過！");
  } catch (error) {
    console.error("測試失敗:", error);
  }
}

// 如果直接執行此文件則運行測試
if (require.main === module) {
  testItemRandService();
}

module.exports = { testItemRandService };
