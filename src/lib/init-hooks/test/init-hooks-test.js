const assert = require('assert');
const proxyquire = require('proxyquire');
const noop = function() {}

describe('Init Hooks', function() {

  it('will require all the hook files in directory', function(done) {
    const init = proxyquire('../index', {})

    init({add_hook: function(name, hook) {
      assert.equal(name, 'boring-webpack', 'Should have required the core hook webpack-dev.js')
      done();
    }})
  });
});