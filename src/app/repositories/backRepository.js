const back = require("../models/back");

/**
 * 透過名稱查找裝備
 * @param {String} name 背飾名稱
 * @param {Boolean} strict 嚴謹搜尋
 */
exports.findByName = async (name, strict = false) => {
  let data = await back();
  return data.filter(d => (strict ? d["名稱"] === name : d["名稱"].indexOf(name) !== -1));
};

/**
 * 查找裝備單一目標
 * @param {String} name 背飾名稱
 * @returns {Promise<Object|null>}
 */
exports.find = async name => {
  let data = await back();
  return data.find(d => d["名稱"] === name);
};
