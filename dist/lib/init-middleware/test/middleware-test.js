"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const assert = require('assert');

const proxyquire = require('proxyquire');

const noop = function () {};

function getMiddlewareFromModule(path) {
  return require(path)({
    boring: {}
  }).then(result => Promise.resolve(result));
}

describe('Init Middleware', function () {
  it('will require all the middleware files in directory',
  /*#__PURE__*/
  _asyncToGenerator(function* () {
    const init = proxyquire('../index', {
      'paths': {
        server_middleware: __dirname + '/test-middleware',
        boring_middleware: __dirname + '/test-middleware2'
      }
    });
    const middlewareReturned = yield init({
      boring: {}
    });
    assert.equal(Object.keys(middlewareReturned).length, 3);
    assert.ok(middlewareReturned.middlewareB, 'This one exported a function so we took the module as the key');
    assert.ok(middlewareReturned.midA, 'there should be a midA object because it exported an object with a name field');
    assert.ok(middlewareReturned.foo, 'This proves you can export an object with func as a key (rather than middleware)');
    const directRequiredMiddlewareFromA = yield getMiddlewareFromModule('./test-middleware/middlewareA');
    const directRequiredMiddlewareFromB = yield getMiddlewareFromModule('./test-middleware/middlewareB');
    const directRequiredMiddlewareFromC = yield getMiddlewareFromModule('./test-middleware2/middlewareC');
    assert.equal(middlewareReturned.midA, directRequiredMiddlewareFromA.middleware);
    assert.equal(middlewareReturned.middlewareB, directRequiredMiddlewareFromB);
    assert.equal(middlewareReturned.foo, directRequiredMiddlewareFromC.func);
  }));
});
//# sourceMappingURL=middleware-test.js.map