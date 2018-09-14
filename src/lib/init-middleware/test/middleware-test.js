const assert = require('assert');
const proxyquire = require('proxyquire');
const noop = function() {}

function getMiddlewareFromModule(path) {
  return require(path)({ boring: {}}).then(result => Promise.resolve(result));
}

describe('Init Middleware', function() {

  it('will require all the middleware files in directory', async () => {
    const init = proxyquire('../index', {
      'paths': {
        server_middleware: __dirname + '/test-middleware',
        boring_middleware: __dirname + '/test-middleware2'
      }
    })

    const middlewareReturned = await init({ boring: {}});

    assert.equal(Object.keys(middlewareReturned).length, 3);
    assert.ok(middlewareReturned.middlewareB, 'This one exported a function so we took the module as the key');
    assert.ok(middlewareReturned.midA, 'there should be a midA object because it exported an object with a name field');
    assert.ok(middlewareReturned.foo, 'This proves you can export an object with func as a key (rather than middleware)');

    const directRequiredMiddlewareFromA = await getMiddlewareFromModule('./test-middleware/middlewareA');
    const directRequiredMiddlewareFromB = await getMiddlewareFromModule('./test-middleware/middlewareB');
    const directRequiredMiddlewareFromC = await getMiddlewareFromModule('./test-middleware2/middlewareC');

    assert.equal(middlewareReturned.midA, directRequiredMiddlewareFromA.middleware);
    assert.equal(middlewareReturned.middlewareB, directRequiredMiddlewareFromB);
    assert.equal(middlewareReturned.foo, directRequiredMiddlewareFromC.func);
  });
});