const assert = require('assert');
const proxyquire = require('proxyquire');
const paths = require('paths');
const config = require('config');
const Understudy = require('understudy');
const noop = function() {};

describe('Init Hooks', function() {

  it('will require all the hook files in directory', function(done) {

    // eslint-disable-next-line no-invalid-this
    this.timeout(5000);

    const init = require('../index');
    const injectionMoch = {
      plugins: {
        splicePlugins: () => {

        },
      },
      boring: {
        paths,
        config,
        app: {
          use: function(middleware) {

          },
          set: function() {},
        },
      },
    };

    Understudy.call(injectionMoch.boring);

    init(injectionMoch);

    done();
  });
});
