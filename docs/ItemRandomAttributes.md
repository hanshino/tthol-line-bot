# Item Random Attributes (物品隨機素質)

這個功能用於管理物品的隨機素質資料。

## 資料庫結構

```sql
CREATE TABLE item_rand (
  id VARCHAR(255) COMMENT '物品id',
  attribute VARCHAR(255) COMMENT '屬性',
  max INTEGER COMMENT '最大值',
  min INTEGER COMMENT '最小值',
  rate INTEGER COMMENT '機率'
);
```

## API 介面

### Model Layer (`src/app/models/itemRand.js`)
- 基礎的資料庫存取模型

### Repository Layer (`src/app/repositories/itemRandRepository.js`)
- `findByItemId(itemId)` - 根據物品ID查詢隨機素質
- `create(data)` - 新增單筆隨機素質記錄
- `createBatch(dataList)` - 批量新增隨機素質記錄
- `update(itemId, attribute, data)` - 更新隨機素質記錄
- `delete(itemId, attribute)` - 刪除指定的隨機素質記錄
- `deleteByItemId(itemId)` - 刪除物品的所有隨機素質記錄

### Service Layer (`src/app/services/itemRandService.js`)
- 封裝 Repository 層的所有方法
- 提供給 Controller 層使用

### Controller Layer (`src/app/controllers/itemController.js`)
- 在 `showItem()` 和 `showMedia()` 函數中加入隨機素質顯示

## 使用方式

### 新增隨機素質資料
```javascript
const itemRandService = require("../services/itemRandService");

// 新增單筆
await itemRandService.create({
  id: "item_001",
  attribute: "str",
  max: 10,
  min: 5,
  rate: 80
});

// 批量新增
await itemRandService.createBatch([
  { id: "item_001", attribute: "str", max: 10, min: 5, rate: 80 },
  { id: "item_001", attribute: "agi", max: 8, min: 3, rate: 60 }
]);
```

### 查詢隨機素質
```javascript
const randomAttributes = await itemRandService.getByItemId("item_001");
console.log(randomAttributes);
// 輸出: [{ id: "item_001", attribute: "str", max: 10, min: 5, rate: 80 }, ...]
```

### 更新和刪除
```javascript
// 更新
await itemRandService.update("item_001", "str", { max: 15, min: 8 });

// 刪除單一屬性
await itemRandService.delete("item_001", "str");

// 刪除物品的所有隨機素質
await itemRandService.deleteByItemId("item_001");
```

## 顯示格式

當物品有隨機素質時，會在物品基本資訊後顯示：

```
隨機素質：
外功：5~10 (20%)
身法：3~8 (30%)
體力：100~200 (50%)
```

**注意**：顯示的機率是經過正規化處理的，會將所有隨機素質的機率加總後換算成100%基準，讓使用者更容易理解各屬性的相對機率。

如果最小值和最大值相同，則顯示為：
```
隨機素質：
外功：10 (25%)
```

## 測試

執行 `test/itemRandService.test.js` 來測試功能是否正常：

```bash
node test/itemRandService.test.js
```
