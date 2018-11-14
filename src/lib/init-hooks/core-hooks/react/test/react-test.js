const assert = require('assert');
const decorators = require('../../../../decorators');

describe('React Tests', function reactTests() {

  let reactHook;
  beforeEach(function() {
    reactHook = require('../index');
  });

  it('will push a decorator that calls entrypoint', done => {

    const injection = {
      boring: {
        decorators,
      },
    };
    reactHook(injection);

    const {
      endpoint,
      reactEntry
     } = injection.boring.decorators.router;

    @endpoint('/foo')
    class Foo {

      @reactEntry('1')
      beep() {

      }
    }

    const metaData = decorators.router.getMetaDataByClass(Foo).metadata;

    assert.equal(metaData.endpoints.beep.methods.get.entrypoint[0].split('/boring').pop(),  '/src/client/pages/1/entrypoint.js');
    assert.ok(injection.boring.react, 'should have pushed an object onto boring');
    done();
  });
});
