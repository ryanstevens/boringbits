const assert = require('assert');
const proxyquire = require('proxyquire');
const paths = require('paths');
const config = require('config');
const Understudy = require('understudy')
const noop = function() {}

describe('Init Hooks', function() {

  it('will require all the hook files in directory', function(done) {

    this.timeout(5000);
    
    const init = require('../index');
    const injectionMoch = {
      boring: {
        add_hook: function(name, hook) {
          assert.equal(name, 'boring-webpack', 'Should have required the core hook webpack-dev.js')
          done();
        },
        paths,
        config,
        app: {
          use: function(middleware) {

          }
        }
      }
    }

    Understudy.call(injectionMoch.boring);

    init(injectionMoch)
  });
});