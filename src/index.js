const { router, route } = require("bottender/router");
const routes = [
  ...require("./app/controllers/templateController").routes,
  ...require("./app/controllers/manualController").routes,
  ...require("./app/controllers/questController").routes,
  ...require("./app/controllers/monsterController").routes,
  ...require("./app/controllers/magicController").routes,
  ...require("./app/controllers/itemController").routes,
  ...require("./app/controllers/advanceController").routes,
  route("*", fallback),
];

function fallback(context) {
  if (context.event.source.type === "user") {
    context.sendText("沒有符合的指令");
  }
}

module.exports = async function App(context) {
  let { userId, type } = context.event.source;
  let { text } = context.event.message;
  console.log(userId, context.event.source[`${type}Id`], text);
  return router(routes);
};
