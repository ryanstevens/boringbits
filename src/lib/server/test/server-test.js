const assert = require('assert');
const proxyquire = require('proxyquire').noPreserveCache();
const injecture = require('injecture');

function express() {
  return {
    listen: ((port, fn) => fn()),
    use: () => {},
    get: () => {},
    post: () => {},
    set: () => {},
    disable: () => {},
  };
}

describe('Boring Server', function() {

  // eslint-disable-next-line no-invalid-this
  this.timeout(20000);
  let Server;
  beforeEach(() => {
    const clear = require('injecture/clear');
    clear();
    Server = proxyquire('../index', {});
  });

  afterEach(() => {
    const injecture = require('injecture');
    const clear = require('injecture/clear');
    clear();
    injecture.selectors = {};
  });

  it('start can take an options callback', async function() {

    const server = new Server({app: express()});
    server.before('listen', async function(bootOptions) {
      assert.ok(bootOptions.webpack_config, 'should have access to webpack in before hook');
      bootOptions.mutateMe = 'ryan';
    });

    const finalConfig = await server.start();

    assert.ok(finalConfig.boring.app, 'should have access to express');
    assert.ok(finalConfig.mutateMe, 'ryan', 'before hook did not run');
    assert.ok(finalConfig.webpack_config, 'There should be a webpack object');

  });

  it('can override startExpress as an option', async () => {

    const weirdPort = 8873322;
    let listenResolved = false;
    let portToListen;
    const server = new Server();

    server.listen.then((val) => {
      listenResolved = val;
    });

    assert.ok(!listenResolved);

    const finalConfig = await server.start({
      startExpress: (app, port) => {
        portToListen = port;
        return Promise.resolve({beep: 'boop'});
      },
      port: weirdPort,
    });
    assert.ok(finalConfig.webpack_config);
    assert.equal(listenResolved.beep, 'boop', 'should be resolved by now with the value returned from startExpress');
    assert.equal(portToListen, weirdPort);
  });

  it('will be able to ask injecture how many servers were created', async () => {
    assert.equal(injecture.allInstances('BoringServer').length, 0);
    const instance1 = new Server();
    assert.equal(injecture.allInstances('BoringServer').length, 1);

    const instance2 = new Server();
    assert.equal(injecture.allInstances('BoringServer').length, 2);

    const instance3 = new Server();
    assert.equal(injecture.allInstances('BoringServer').length, 3);

    assert.deepEqual([instance1, instance2, instance3], injecture.allInstances('BoringServer'));
  });

  // this acts more like an integration test than unit as it will
  // inspect the finalConfig and look for specific properties the
  // init pipeline as responsible for
  it('will return a finalConfig with expected properties', async () => {

    const server = new Server();

    const finalConfig = await server.start({
      startExpress: (app, port) => {
        return Promise.resolve();
      },
    });

    assert.ok(finalConfig.webpack_config);
    assert.equal(finalConfig.plugins.active['boring-plugins-default'].value.foo, 'bar');
    assert.equal(finalConfig.plugins.active['boring-plugins-default'].initedRoute, true, 'Proves the router was ran');
    assert.ok(finalConfig.decorators.injecture, 'injecture is a core decorator');
    assert.ok(finalConfig.decorators.logger.log);

  });

});
