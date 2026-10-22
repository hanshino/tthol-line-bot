// Minimal replacement for bottender/router (ported from redive_linebot's native engine).
// First matching route wins; a predicate may return an object that is merged into props.

function router(routes) {
  return async function Router(context, props = {}) {
    for (const r of routes) {
      const match = await r.predicate(context);
      if (match) {
        const derivedProps = typeof match === "object" ? match : {};
        return r.action.bind(null, context, Object.assign({}, props, derivedProps));
      }
    }
    return props.next;
  };
}

function route(pattern, action) {
  return { predicate: pattern === "*" ? () => true : pattern, action };
}

function text(pattern, action) {
  if (pattern === "*") return route(context => context.event.isText, action);
  if (typeof pattern === "string") return route(context => context.event.text === pattern, action);
  if (pattern instanceof RegExp) {
    return route(context => {
      if (!context.event.isText) return false;
      const match = pattern.exec(context.event.text);
      return match ? { match } : false;
    }, action);
  }
  return route(() => false, action);
}

// Actions may return the next action (e.g. App returns router(routes)); keep calling until done.
async function run(action, context, props = {}) {
  let result = await action(context, props);
  while (typeof result === "function") result = await result(context, {});
  return result;
}

module.exports = { router, route, text, run };
