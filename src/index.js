const { router, text } = require("bottender/router");
const routes = [
  ...require("./app/controllers/questController").routes,
  ...require("./app/controllers/itemController").routes,
  ...require("./app/controllers/monsterController").routes,
  text("*", context => context.sendText("沒有符合的指令")),
];

module.exports = async function App() {
  return router(routes);
};
