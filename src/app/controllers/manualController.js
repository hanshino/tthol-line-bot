const { text } = require("bottender/router");
const manual = require("../../configs/manual.config");

exports.routes = manual.map(route => text(route.regex, context => context.replyText(route.send)));
