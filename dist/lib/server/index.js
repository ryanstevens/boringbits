"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const config = require('boring-config');

const logger = require('boring-logger');

const paths = require('paths');

const util = require('util');

const InitPipeline = require('../init-pipeline');

function startExpress(_x, _x2) {
  return _startExpress.apply(this, arguments);
}

function _startExpress() {
  _startExpress = _asyncToGenerator(function* (app, port) {
    app.listen = util.promisify(app.listen);
    return app.listen(port);
  });
  return _startExpress.apply(this, arguments);
}

class BoringServer extends InitPipeline {
  constructor() {
    super();
  }

  start(options) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const injections = yield _this.build(Object.assign({}, {
        webpack_config: require(paths.boring_webpack_dev_config)
      }, options));
      const port = process.env.PORT || config.get('boring.app.port');
      injections.port = port;
      return yield _this.perform('listen', injections,
      /*#__PURE__*/
      _asyncToGenerator(function* () {
        yield startExpress(_this.app, port);
        logger.info('Listening on port ' + port);
        return injections;
      }));
    })();
  }

}

module.exports = BoringServer;
//# sourceMappingURL=index.js.map