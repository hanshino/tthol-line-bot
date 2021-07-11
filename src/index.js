const { router, text } = require("bottender/router");
const routes = [
  ...require("./app/controllers/itemController").routes,
  text("*", context => context.sendText("沒有符合的指令")),
];

module.exports = async function App() {
  return router(routes);
};
