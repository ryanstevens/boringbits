const assert = require('assert');
const proxyquire = require('proxyquire').noPreserveCache();
const logger = require('boring-logger');
const Emitter = require('eventemitter2');
const decorators = require('../../decorators')
const Understudy = require('boring-understudy')

const noop = function() {}

function findByName(arr, name) {
  for (var i=0; i<arr.length; i++) {
    if (arr[i].name === name) return arr[i];
  }
  return undefined;
}

function wipeInjectoreStore() {
  
  const jectureStore = require('injecture/injecture-store');
  const jecture_keys = Object.keys(jectureStore);
  jecture_keys.forEach(key => {
    const stored = jectureStore[key]
    stored.instances = {};
  });

}

describe('Init Endpoints', function() {

  this.timeout(7000)

  function mockRequireAll(dataToMock) {

    wipeInjectoreStore()

    return proxyquire('../index', {
      'require-inject-all': function() {
        return new Promise((resolve) => {
          resolve(dataToMock);
        });
      },
    })
  }

  afterEach(function() {
    wipeInjectoreStore();
  })
 

  it('will install endpoint verbs from JSON', function(done) {

    const init = mockRequireAll({
      "pageA": {
        path: '/meow',
        endpoints: [
          {
            path: '/foo',
            methods: {
              get: noop
            }
          }
        ]
      },
      "pageB": {
        endpoints: [
          {
            path: '/beep',
            methods: {
              post: noop,
              head: noop
            }
          }
        ]
      },
      "pageC": undefined
    })
    
    class Boring extends Emitter {
      constructor() {
        super({});
        Understudy.call(this);
        this.app = {};
        this.decorators = decorators;

      }
    }

    const boring = new Boring();

    init({boring}).then(result => {

      const pageA = findByName(result, 'pageA');
      const pageB = findByName(result, 'pageB');
      const pageC = findByName(result, 'pageC');

      assert.equal(Object.keys(pageA.endpoints[0].methods).length, 1);
      assert.equal(Object.keys(pageB.endpoints[0].methods).length, 2);
      
      assert.equal(pageC.endpoints.length, 0);
      
      done();
    })
  });

  it('will install endpoint verbs from annotation', done => {

    const init = mockRequireAll({});
    
    class Boring extends Emitter {
      constructor() {
        super({wildcard: true});
        Understudy.call(this);
        this.app = {};
        this.decorators = decorators;
      }
    }

    const boring = new Boring();
    
    const { 
      endpoint,
      get
    }= decorators.router;

    const calls = [];

    // this is to simply fire the 
    // event decorator.router.endpoint
    @endpoint('/meow')
    class Stuff {

      @get('/beep')
      serveFoo() {
        calls.push('meat')
      }

      @get('/guz')
      meep() {
        calls.push('meep')
      }
    }

    init({boring}).then(result => {
      assert.equal(result.length, 1);
      assert.equal(result[0].endpoints.length, 2, 'There should be two endpoints');
      assert.equal(result[0].endpoints[0].path, '/beep');
      result[0].endpoints[0].methods.get.handler();

      assert.notEqual(calls[0], 'meat', 'serveFoo is not executed sync due to some promises in the middle of the chain');

      setImmediate(() => {

        assert.equal(calls[0], 'meat', 'serveFoo was not executed');

        assert.equal(result[0].endpoints[1].path, '/guz');
        result[0].endpoints[1].methods.get.handler();
        
        setImmediate(() => {
          assert.equal(calls[1], 'meep');
        
          done();
        });
      });
    })

  });


  it('should allow a hook to pause the handler', done => {

    const init = mockRequireAll({});
    
    class Boring extends Emitter {
      constructor() {
        super({wildcard: true});
        Understudy.call(this);
        this.app = {};
        this.decorators = decorators;

      }
    }

    const boring = new Boring();
    
    const { 
      endpoint,
      get
    }= decorators.router;

    const calls = [];

    @endpoint()
    class Stuff {

      @get('/foo')
      foo() {
        calls.push('matt')
      }

    }

    init({boring}).then(result => {

      boring.before('http::get', function(ctx) {
        return new Promise(resolve => {
          setTimeout(resolve, 100);
        })
      });

      result[0].endpoints[0].methods.get.handler();
      assert.equal(calls.length, 0);

      //check once
      setTimeout(function() {
        assert.equal(calls.length, 0);
      }, 50);

      //last check, this one should be set 
      setTimeout(function() {
        assert.equal(calls[0], 'matt');
        done();
      }, 200);

    })

  });

});