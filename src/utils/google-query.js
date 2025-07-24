const axios = require("axios");

/**
 * Fetch Google Sheet Data By SQL
 * @param {Object}  params
 * @param {String}  params.gid  Google Sheet tab id
 * @param {String}  params.type Fetch Type
 * - json
 * - html
 * @param {String}  params.query  SQL statement
 * @param {String}  params.key  Google Sheet Key
 * @return {Promise<Array>}
 */
module.exports = params => {
  let { gid, type, query, key } = params;
  let queryString = new URLSearchParams();

  queryString.set("gid", gid);
  queryString.set("tqx", `out:${type}`);
  queryString.set("tq", query);

  let url = `https://docs.google.com/spreadsheets/u/0/d/${key}/gviz/tq?${queryString.toString()}`;

  return axios
    .get(url)
    .then(res => res.data)
    .then(res => res.match(/\{.*\}/)[0])
    .then(data => {
      try {
        return queryParser(JSON.parse(data));
      } catch (e) {
        return null;
      }
    });
};

function queryParser(data) {
  let rows = data.table.rows;
  let title = data.table.cols.map(col => (col.label !== "" ? col.label.trim() : col.id));

  let result = [];

  rows.forEach(row => {
    let temp = {};
    row.c.forEach((value, index) => {
      if (value === null) return;
      temp[title[index]] = value.f || value.v;
    });
    result.push(temp);
  });

  return result;
}
