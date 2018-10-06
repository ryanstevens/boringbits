"use strict";

var router = _interopRequireWildcard(require("./router"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function subscribeDecorators(emitter) {
  router.subscribeDecorators(emitter);
}

module.exports = {
  router,
  subscribeDecorators: subscribeDecorators
};
//# sourceMappingURL=index.js.map