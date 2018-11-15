"use strict";

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

const assert = require('assert');

const decorators = require('../../../../decorators');

const Understudy = require('boring-understudy');

describe('React Tests', function reactTests() {
  let reactHook;
  beforeEach(function () {
    reactHook = require('../index');
  });
  it('will push a decorator that calls entrypoint', done => {
    var _dec, _dec2, _dec3, _class, _class2;

    const injection = {
      boring: {
        decorators
      }
    };
    Understudy.call(injection.boring);
    reactHook(injection);
    const {
      endpoint,
      reactEntry,
      entrypoint,
      get
    } = injection.boring.decorators.router;
    let Foo = (_dec = endpoint('/foo'), _dec2 = reactEntry('1'), _dec3 = get('/be'), _dec(_class = (_class2 = class Foo {
      beep() {}

    }, (_applyDecoratedDescriptor(_class2.prototype, "beep", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "beep"), _class2.prototype)), _class2)) || _class);
    const metaData = decorators.router.getMetaDataByClass(Foo).metadata;
    assert.equal(metaData.endpoints.beep.methods.get.entrypoint[1].split('/boring').pop(), '/src/client/pages/1/entrypoint.js');
    assert.equal(metaData.endpoints.beep.methods.get.reactEntry[0].reactRoot, '1');
    assert.ok(injection.boring.react, 'should have pushed an object onto boring');
    done();
  });
});
//# sourceMappingURL=react-test.js.map