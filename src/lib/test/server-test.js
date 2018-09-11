const assert = require('assert');
const proxyquire = require('proxyquire');
const logger = require('boring-logger');

describe('Boring Server', function() {

  this.timeout(20000);
  let Server;
  beforeEach(() => {  
    Server = proxyquire('../server', {
      express: function appToReturn() {
          return { listen: ((port, fn) => fn()) }
        }
      }
    )
  })

  it('start can take an options callback', async function() {

    const server = new Server();
    const boringObj = await server.start(config => Object.assign({}, config))
    
    assert.ok(boringObj.app, 'There is no express object');

  });

});