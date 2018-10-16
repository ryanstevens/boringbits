"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const assert = require('assert');

const proxyquire = require('proxyquire');

const logger = require('boring-logger');

describe('Boring Server', function () {
  this.timeout(20000);
  let Server;
  beforeEach(() => {
    const init = proxyquire('../../init-pipeline', {
      express: function appToReturn() {
        return {
          listen: (port, fn) => fn(),
          use: function () {},
          get: function () {},
          post: function () {}
        };
      }
    });
    Server = proxyquire('../index', {
      '../init-pipeline': init
    });
  });
  it('start can take an options callback',
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    const server = new Server();
    server.before('listen',
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(function* (bootOptions) {
        assert.ok(bootOptions.webpack_config, 'should have access to webpack in before hook');
        bootOptions.mutateMe = 'ryan';
      });

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
    const final_config = yield server.start();
    assert.ok(final_config.boring.app, 'should have access to express');
    assert.ok(final_config.mutateMe, 'ryan', 'before hook did not run');
    assert.ok(final_config.webpack_config, 'There should be a webpack object');
    console.log("####");
  }));
});
//# sourceMappingURL=server-test.js.map