"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const InitPipeline = require('./init-pipeline');

const paths = require('paths');

class Builder extends InitPipeline {
  start(options) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return yield _this.build(Object.assign({}, {
        webpack_config: require(paths.boring_webpack_prod_config)
      }, options));
    })();
  }

}

module.exports = new Builder();
//# sourceMappingURL=prod-webpack-build.js.map