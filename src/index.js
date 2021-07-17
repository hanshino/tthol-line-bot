const { router, text } = require("bottender/router");
const routes = [
  ...require("./app/controllers/templateController").routes,
  ...require("./app/controllers/manualController").routes,
  ...require("./app/controllers/questController").routes,
  ...require("./app/controllers/monsterController").routes,
  ...require("./app/controllers/magicController").routes,
  ...require("./app/controllers/itemController").routes,
  // text("*", context => context.sendText("沒有符合的指令")),
];

module.exports = async function App(context) {
  let { userId, type } = context.event.source;
  let { text } = context.event.message;
  console.log(userId, text);
  return router(routes);
};
