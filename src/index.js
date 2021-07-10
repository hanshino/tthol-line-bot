const { router } = require("bottender/router");
const routes = [...require("./app/controllers/itemController").routes];

module.exports = async function App() {
  return router(routes);
};
