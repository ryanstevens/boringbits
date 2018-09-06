const assert = require('assert');
const proxyquire = require('proxyquire');
const logger = require('boring-logger');

describe('Boring Server', function() {

  this.timeout(5000);

  let server;
  beforeEach(() => server = proxyquire('../server', {
    express: function appToReturn() {
      return { listen: ((port, fn) => fn()) }
    }
  }))

  it('start can take an options callback', function(done) {

    server.start(config => Object.assign({}, config))
      .then((boringObj) => {
        assert.ok(boringObj.app, 'There is no express object');
        done();
      })

  });

});