const assert = require('assert');
const proxyquire = require('proxyquire');
const logger = require('boring-logger');
const Emitter = require('eventemitter2');

const noop = function() {}
describe('Init Endpoints', function() {

  this.timeout(7000)

  function mockRequireAll(dataToMock, connect_express) {
    return proxyquire('../index', {
      'require-inject-all': function() {
        return new Promise((resolve) => {
          resolve(dataToMock);
        });
      },
      './connect_express': connect_express || noop
    })
  }
 

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
        this.app = {};
      }
    }

    const boring = new Boring();

    init(boring).then(result => {
      assert.ok(result.pageA.endpoints);
      assert.ok(result.pageB.endpoints);
      
      assert.ok('pageC' in result);
      assert.ok(result.pageC === undefined);
      
      done();
    })
  });

  it('will install endpoint verbs from annotation', done => {

    
    class Boring extends Emitter {
      constructor() {
        super({wildcard: true});
        this.app = {};
      }
    }

    const boring = new Boring();
    let stuffProto;

    const init = mockRequireAll({},
      function express_connect_moch(express_app, route) {
        // we need to pop out of the event loop
        // in order for stuffServe to be asssigned
        setTimeout(() => {

          assert.equal(route.endpoints.length, 2, 'There should be two endpoints');
          assert.equal(route.endpoints[0].path, '/beep');
          assert.equal(route.endpoints[0].methods.get, stuffProto.serveFoo);
          assert.equal(route.endpoints[1].path, '/guz');
          assert.equal(route.endpoints[1].methods.get, stuffProto.meep);
          done();

        }, 0)
      }
    );

    init(boring).then(result => {

      const { 
        endpoint,
        get
      }= boring.decorators.endpoint;

      // this is to simply fire the 
      // event decorator.endpoint.endpoint
      @endpoint('/meow')
      class Stuff {

        @get('/beep')
        serveFoo() {
          // TODO RYAN, deal with method
        }

        @get('/guz')
        meep() {

        }
      }

      stuffProto = Stuff.prototype;
      
    })
  });

});