"use strict";

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

const assert = require('assert');

const proxyquire = require('proxyquire').noPreserveCache();

const transformer = require('../transform-annotation');

const decorators = require('../../decorators/router');

describe('Transform Annotations', function () {
  it('Will transform class metadata', done => {
    var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2;

    const {
      endpoint,
      get,
      post,
      getMetaDataByClass
    } = decorators; // this is to simply fire the
    // event decorator.router.endpoint

    let Stuff = (_dec = endpoint('/meow'), _dec2 = get('/beep'), _dec3 = post('/beep'), _dec4 = get('/guz'), _dec5 = post('/guz'), _dec(_class = (_class2 = class Stuff {
      serveFoo() {}

      meep() {}

      jeep() {}

    }, (_applyDecoratedDescriptor(_class2.prototype, "serveFoo", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "serveFoo"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "meep", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "meep"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "jeep", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "jeep"), _class2.prototype)), _class2)) || _class);
    const endpoint_meta = transformer(getMetaDataByClass(Stuff).metadata); //    console.log(JSON.stringify(endpoint_meta, null, 2))

    assert.deepEqual(endpoint_meta, {
      "path": "/meow",
      "endpoints": [{
        "methods": {
          "get": {
            "path": "/beep",
            "handler": Stuff.prototype.serveFoo
          },
          "post": {
            "path": "/beep",
            "handler": Stuff.prototype.serveFoo
          }
        }
      }, {
        "methods": {
          "get": {
            "path": "/guz",
            "handler": Stuff.prototype.meep
          }
        }
      }, // WHATEVS, for now this wasn't the goal as
      // this should be combined with the GET:/guz.
      // TODO: fix later.  This can be left as is
      // because connect_express will treat this all the same
      {
        "methods": {
          "post": {
            "path": "/guz",
            "handler": Stuff.prototype.jeep
          }
        }
      }]
    });
    done();
  });
});
//# sourceMappingURL=transform-annotations-test.js.map