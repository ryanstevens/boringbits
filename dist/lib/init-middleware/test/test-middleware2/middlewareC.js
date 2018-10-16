"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function func(req, res, next) {
  res.send('B');
  next();
}

module.exports =
/*#__PURE__*/
function () {
  var _registerMiddleware = _asyncToGenerator(function* (boring) {
    return {
      name: 'foo',
      func
    };
  });

  return function registerMiddleware(_x) {
    return _registerMiddleware.apply(this, arguments);
  };
}();
//# sourceMappingURL=middlewareC.js.map