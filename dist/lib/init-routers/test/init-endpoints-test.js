"use strict";

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

const assert = require('assert');

const proxyquire = require('proxyquire').noPreserveCache();

const logger = require('boring-logger');

const Emitter = require('eventemitter2');

const decorators = require('../../decorators');

const Understudy = require('boring-understudy');

const injecture = require('injecture');

const noop = function () {};

function findByName(arr, name) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name === name) return arr[i];
  }

  return undefined;
}

function wipeInjectoreStore() {
  debugger;
  const jectureStore = injecture.getInstanceByInterface('instanceStore'); // require('injecture/injecture-store');

  const jecture_keys = Object.keys(jectureStore);
  jecture_keys.forEach(key => {
    const stored = jectureStore[key];
    stored.instances = {};
  });
}

describe('Init Endpoints', function () {
  this.timeout(7000);

  function mockRequireAll(dataToMock) {
    wipeInjectoreStore();
    return proxyquire('../index', {
      'require-inject-all': function () {
        return new Promise(resolve => {
          resolve(dataToMock);
        });
      }
    });
  }

  afterEach(function () {
    wipeInjectoreStore();
  });
  it('will install endpoint verbs from JSON', function (done) {
    const init = mockRequireAll({
      "pageA": {
        endpoints: [{
          methods: {
            get: noop
          }
        }]
      },
      "pageB": {
        endpoints: [{
          methods: {
            post: noop,
            head: noop
          }
        }]
      },
      "pageC": undefined
    });

    class Boring extends Emitter {
      constructor() {
        super({});
        Understudy.call(this);
        this.app = {};
        this.decorators = decorators;
      }

    }

    const boring = new Boring();
    init({
      boring
    }).then(result => {
      const pageA = findByName(result, 'pageA');
      const pageB = findByName(result, 'pageB');
      const pageC = findByName(result, 'pageC');
      assert.equal(Object.keys(pageA.endpoints[0].methods).length, 1);
      assert.equal(Object.keys(pageB.endpoints[0].methods).length, 2);
      assert.equal(pageC.endpoints.length, 0);
      done();
    });
  });
  it('will install endpoint verbs from annotation', done => {
    var _dec, _dec2, _dec3, _class, _class2;

    const init = mockRequireAll({});

    class Boring extends Emitter {
      constructor() {
        super({
          wildcard: true
        });
        Understudy.call(this);
        this.app = {};
        this.decorators = decorators;
      }

    }

    const boring = new Boring();
    const {
      endpoint,
      get
    } = decorators.router;
    const calls = []; // this is to simply fire the
    // event decorator.router.endpoint

    let Stuff = (_dec = endpoint('/meow'), _dec2 = get('/beep'), _dec3 = get('/guz'), _dec(_class = (_class2 = class Stuff {
      serveFoo() {
        calls.push('meat');
      }

      meep() {
        calls.push('meep');
      }

    }, (_applyDecoratedDescriptor(_class2.prototype, "serveFoo", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "serveFoo"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "meep", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "meep"), _class2.prototype)), _class2)) || _class);
    init({
      boring
    }).then(result => {
      assert.equal(result.length, 1);
      assert.equal(result[0].endpoints.length, 2, 'There should be two endpoints');
      assert.equal(result[0].endpoints[0].methods.get.path, '/beep');
      result[0].endpoints[0].methods.get.handler();
      assert.notEqual(calls[0], 'meat', 'serveFoo is not executed sync due to some promises in the middle of the chain');
      setImmediate(() => {
        assert.equal(calls[0], 'meat', 'serveFoo was not executed');
        assert.equal(result[0].endpoints[1].methods.get.path, '/guz');
        result[0].endpoints[1].methods.get.handler();
        setImmediate(() => {
          assert.equal(calls[1], 'meep');
          done();
        });
      });
    });
  });
  it('should allow a hook to pause the handler', done => {
    var _dec4, _dec5, _class3, _class4;

    const init = mockRequireAll({});

    class Boring extends Emitter {
      constructor() {
        super({
          wildcard: true
        });
        Understudy.call(this);
        this.app = {};
        this.decorators = decorators;
      }

    }

    const boring = new Boring();
    const {
      endpoint,
      get
    } = decorators.router;
    const calls = [];
    let Stuff = (_dec4 = endpoint(), _dec5 = get('/foo'), _dec4(_class3 = (_class4 = class Stuff {
      foo() {
        calls.push('matt');
      }

    }, (_applyDecoratedDescriptor(_class4.prototype, "foo", [_dec5], Object.getOwnPropertyDescriptor(_class4.prototype, "foo"), _class4.prototype)), _class4)) || _class3);
    init({
      boring
    }).then(result => {
      boring.before('http::get', function (ctx) {
        return new Promise(resolve => {
          setTimeout(resolve, 100);
        });
      });
      result[0].endpoints[0].methods.get.handler();
      assert.equal(calls.length, 0); //check once

      setTimeout(function () {
        assert.equal(calls.length, 0);
      }, 50); //last check, this one should be set

      setTimeout(function () {
        assert.equal(calls[0], 'matt');
        done();
      }, 200);
    });
  });
});
//# sourceMappingURL=init-endpoints-test.js.map