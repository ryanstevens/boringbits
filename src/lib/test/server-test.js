const assert = require('assert');
const proxyquire = require('proxyquire');
const logger = require('boring-logger');

describe('Boring Server', function() {

  this.timeout(20000);
  let Server;
  beforeEach(() => {  
    Server = proxyquire('../server', {
      express: function appToReturn() {
          return { 
            listen: ((port, fn) => fn()),
            use: function() {
              
            }
          }
        }
      }
    )
  })

  it('start can take an options callback', async function() {

    const server = new Server();
    server.before('listen', async function(bootOptions) {
      assert.ok(bootOptions.webpack, 'should have access to webpack in before hook');
      bootOptions.mutateMe = 'ryan'
    });

    const final_config = await server.start(config => Object.assign({}, config))

    assert.ok(final_config.boring.app, 'should have access to express');
    assert.ok(final_config.mutateMe, 'ryan', 'before hook did not run');
    assert.ok(final_config.webpack, 'There should be a webpack object');

  });

});