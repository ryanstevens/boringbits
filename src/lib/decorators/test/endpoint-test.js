const assert = require('assert');
const logger = require('boring-logger');
const Emitter = require('eventemitter2');
const injecture = require('injecture');

describe('Endpoint decorator', function() {

  let endpoint_decortators;

  beforeEach(() => {
    endpoint_decortators = require('../router');
  })


  it('will push a prop into the class prototype', done => {
    const { endpoint, get, getMetaDataByClass} = endpoint_decortators;

    @endpoint('/foo')
    class Meow {

      @get('/beep')
      bark() {

      }

      @get('/boop')
      meow() {

      }
    }


    const classMetaData = getMetaDataByClass(Meow).metadata;
    assert.equal(classMetaData.path, '/foo');
    assert.equal(classMetaData.endpoints.bark.path, '/beep');
    assert.equal(classMetaData.endpoints.bark.methods.get.handler, Meow.prototype.bark);
    assert.equal(classMetaData.endpoints.meow.path, '/boop');
    assert.equal(classMetaData.endpoints.meow.methods.get.handler, Meow.prototype.meow);
    done();
  });


  it('will combine annotations into the metadata', done => {
    const { endpoint, get, middleware, post, entrypoint, getMetaDataByClass} = endpoint_decortators;

    @endpoint('/bar')
    class Meow {

      @get('/beep')
      @middleware('meep')
      @entrypoint('foo_client.js')
      screetch() {

      }

      @post('/beep')
      stopper() {

      }
    }

    const classMetaData = getMetaDataByClass(Meow).metadata;
    assert.equal(classMetaData.endpoints.screetch.middleware[0], 'meep');
    assert.equal(classMetaData.endpoints.screetch.path, '/beep');
    assert.equal(classMetaData.endpoints.screetch.methods.get.handler, Meow.prototype.screetch);
    assert.deepEqual(classMetaData.endpoints.screetch.methods.get.entrypoint, ['foo_client.js'])
    assert.equal(classMetaData.endpoints.stopper.methods.post.handler, Meow.prototype.stopper);
    done();
  });


  it('will reply all added decorated classes when a new emitter is added', done => {
    const { endpoint, get, middleware, post, entrypoint, getMetaDataByClass, subscribeDecorators} = endpoint_decortators;

    const emitter1 = new Emitter({wildcard: true});
    const emitterCollecter1 = []

    emitter1.on('decorator.router.*', function(...args) {
      emitterCollecter1.push({
        eventName: this.event,
        args
      });
    })
    subscribeDecorators(emitter1);

    @endpoint('/foo')
    class Class1 {

    }


    @endpoint('/bar')
    class Class2 {

    }

    assert.equal(emitterCollecter1.length, 2, 'There should be two classes that were created');

    const instances = injecture.allInstances('decorator.router.endpoint');

    assert.ok(instances.indexOf(Class1) >= 0);
    assert.ok(instances.indexOf(Class2) >= 0);
    done();

  })

  it('will ensure get is actually wrapped', done => {
    const { endpoint, get, middleware, post, entrypoint, getMetaDataByClass, subscribeDecorators} = endpoint_decortators;

    @endpoint('/foo')
    class Clazz {

      @get('/bar')
      beep() {
        console.log('beep');
      }
    }

    const clazz = new Clazz();
    clazz.beep();

    done();
  });


});