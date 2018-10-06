"use strict";

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object['ke' + 'ys'](descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object['define' + 'Property'](target, property, desc); desc = null; } return desc; }

const assert = require('assert');

const logger = require('boring-logger');

const Emitter = require('eventemitter2');

const injecture = require('injecture');

describe('Endpoint decorator', function () {
  let endpoint_decortators;
  beforeEach(() => {
    endpoint_decortators = require('../router');
  });
  it('will push a prop into the class prototype', done => {
    var _dec, _dec2, _dec3, _class, _class2;

    const {
      endpoint,
      get,
      middleware,
      post,
      entrypoint,
      getMetaDataByClass
    } = endpoint_decortators;
    let Meow = (_dec = endpoint('/foo'), _dec2 = get('/beep'), _dec3 = get('/boop'), _dec(_class = (_class2 = class Meow {
      bark() {}

      meow() {}

    }, (_applyDecoratedDescriptor(_class2.prototype, "bark", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "bark"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "meow", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "meow"), _class2.prototype)), _class2)) || _class);
    const classMetaData = getMetaDataByClass(Meow).metadata;
    assert.equal(classMetaData.path, '/foo');
    assert.equal(classMetaData.endpoints.bark.path, '/beep');
    assert.equal(classMetaData.endpoints.bark.methods.get.handler, Meow.prototype.bark);
    assert.equal(classMetaData.endpoints.meow.path, '/boop');
    assert.equal(classMetaData.endpoints.meow.methods.get.handler, Meow.prototype.meow);
    done();
  });
  it('will combine annotations into the metadata', done => {
    var _dec4, _dec5, _dec6, _dec7, _dec8, _class3, _class4;

    const {
      endpoint,
      get,
      middleware,
      post,
      entrypoint,
      getMetaDataByClass
    } = endpoint_decortators;
    let Meow = (_dec4 = endpoint('/bar'), _dec5 = get('/beep'), _dec6 = middleware('meep'), _dec7 = entrypoint('foo_client.js'), _dec8 = post('/beep'), _dec4(_class3 = (_class4 = class Meow {
      screetch() {}

      stopper() {}

    }, (_applyDecoratedDescriptor(_class4.prototype, "screetch", [_dec5, _dec6, _dec7], Object.getOwnPropertyDescriptor(_class4.prototype, "screetch"), _class4.prototype), _applyDecoratedDescriptor(_class4.prototype, "stopper", [_dec8], Object.getOwnPropertyDescriptor(_class4.prototype, "stopper"), _class4.prototype)), _class4)) || _class3);
    const classMetaData = getMetaDataByClass(Meow).metadata;
    assert.equal(classMetaData.endpoints.screetch.middleware[0], 'meep');
    assert.equal(classMetaData.endpoints.screetch.path, '/beep');
    assert.equal(classMetaData.endpoints.screetch.methods.get.handler, Meow.prototype.screetch);
    assert.equal(classMetaData.endpoints.screetch.methods.get.entrypoint, 'foo_client.js');
    assert.equal(classMetaData.endpoints.stopper.methods.post.handler, Meow.prototype.stopper);
    done();
  });
  it('will reply all added decorated classes when a new emitter is added', done => {
    var _dec9, _class5, _dec10, _class6;

    const {
      endpoint,
      get,
      middleware,
      post,
      entrypoint,
      getMetaDataByClass,
      subscribeDecorators
    } = endpoint_decortators;
    const emitter1 = new Emitter({
      wildcard: true
    });
    const emitterCollecter1 = [];
    emitter1.on('decorator.router.*', function (...args) {
      emitterCollecter1.push({
        eventName: this.event,
        args
      });
    });
    subscribeDecorators(emitter1);
    let Class1 = (_dec9 = endpoint('/foo'), _dec9(_class5 = class Class1 {}) || _class5);
    let Class2 = (_dec10 = endpoint('/bar'), _dec10(_class6 = class Class2 {}) || _class6);
    assert.equal(emitterCollecter1.length, 2, 'There should be two classes that were created');
    const instances = injecture.allInstances('decorator.router.endpoint');
    assert.ok(instances.indexOf(Class1) >= 0);
    assert.ok(instances.indexOf(Class2) >= 0);
    done();
  });
  it('will ensure get is actually wrapped', done => {
    var _dec11, _dec12, _class7, _class8;

    const {
      endpoint,
      get,
      middleware,
      post,
      entrypoint,
      getMetaDataByClass,
      subscribeDecorators
    } = endpoint_decortators;
    let Clazz = (_dec11 = endpoint('/foo'), _dec12 = get('/bar'), _dec11(_class7 = (_class8 = class Clazz {
      beep() {
        console.log('beep');
      }

    }, (_applyDecoratedDescriptor(_class8.prototype, "beep", [_dec12], Object.getOwnPropertyDescriptor(_class8.prototype, "beep"), _class8.prototype)), _class8)) || _class7);
    const clazz = new Clazz();
    clazz.beep();
    done();
  });
});
//# sourceMappingURL=endpoint-test.js.map