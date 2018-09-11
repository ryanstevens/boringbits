const assert = require('assert');
const proxyquire = require('proxyquire');
const noop = function() {}

describe('Init Middleware', function() {

  it('will require all the middleware files in directory', async () => {
    const init = proxyquire('../index', {
      'paths': {
        server_middleware: __dirname + '/test-middleware',
        boring_middleware: __dirname + '/test-middleware2'
      }
    })

    const middlewareAdded = {};
    const middlewareReturned = await init({
      add_middleware: function(name, middleware) {
        middlewareAdded[name] = middleware;
      }
    });

    assert.equal(Object.keys(middlewareReturned).length, 3);
    assert.ok(middlewareReturned.middlewareB, 'This one exported a function so we took the module as the key');
    assert.ok(middlewareReturned.midA, 'there should be a midA object because it exported an object with a name field');
    assert.ok(middlewareReturned.foo, 'This proves you can export an object with func as a key (rather than middleware)');

    assert.equal(middlewareReturned.midA, middlewareAdded.midA);
    assert.equal(middlewareReturned.middlewareB, middlewareAdded.middlewareB);
    assert.equal(middlewareReturned.foo, middlewareAdded.foo);
  });
});