const assert = require('assert');
const proxyquire = require('proxyquire');
const logger = require('boring-logger');

describe('Boring Server', function() {

  let server;
  beforeEach(() => server = proxyquire('../server', {
    express: function appToReturn() {
      return { listen: ((port, fn) => fn()) }
    }
  }));

  it('start can take an options callback', function(done) {

    server.start(function(config) {
      return Object.assign({}, config);
    }).then((boringObj) => {
      assert.ok(boringObj.app, 'There is no express object');
      done();
    })
  });

});