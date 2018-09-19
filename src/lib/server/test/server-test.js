const assert = require('assert');
const proxyquire = require('proxyquire');
const logger = require('boring-logger');

describe('Boring Server', function() {

  this.timeout(20000);
  let Server;
  beforeEach(() => {  
    const init = proxyquire('../../init-pipeline', {
      express: function appToReturn() {
          return { 
            listen: ((port, fn) => fn()),
            use: function() {},
            get: function() {},
            post: function() {}
          }
        }
      }
    )

    Server = proxyquire('../index', {
      '../init-pipeline': init
      }
    )
  })

  it('start can take an options callback', async function() {

    const server = new Server();
    server.before('listen', async function(bootOptions) {
      assert.ok(bootOptions.webpack_config, 'should have access to webpack in before hook');
      bootOptions.mutateMe = 'ryan'
    });

    const final_config = await server.start();

    assert.ok(final_config.boring.app, 'should have access to express');
    assert.ok(final_config.mutateMe, 'ryan', 'before hook did not run');
    assert.ok(final_config.webpack_config, 'There should be a webpack object');

    console.log("####")
  });

});