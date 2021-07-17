const { text } = require("bottender/router");
const manual = require("../../configs/manual.config");

routes = manual.map(route => text(route.regex, context => context.sendText(route.send)));

exports.routes = routes;
