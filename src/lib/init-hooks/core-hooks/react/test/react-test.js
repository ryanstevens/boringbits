const assert = require('assert');
const decorators = require('../../../../decorators');
const Understudy = require('boring-understudy');


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

    Understudy.call(injection.boring);

    reactHook(injection);

    const {
      endpoint,
      reactEntry,
      entrypoint,
      get
     } = injection.boring.decorators.router;

    @endpoint('/foo')
    class Foo {

      @reactEntry('1')
      @get('/be')
      beep() {

      }
    }

    const metaData = decorators.router.getMetaDataByClass(Foo).metadata;

    assert.equal(metaData.endpoints.beep.methods.get.entrypoint[0].split('/boring').pop(),  '/src/client/pages/1/entrypoint.js');
    assert.equal(metaData.endpoints.beep.methods.get.reactEntry[0].reactRoot,  '1');
    assert.ok(injection.boring.react, 'should have pushed an object onto boring');
    done();
  });
});
