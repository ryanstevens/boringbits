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

    done();
  });
});