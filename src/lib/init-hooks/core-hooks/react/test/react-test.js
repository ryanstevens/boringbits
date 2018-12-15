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
    
    const [beforeEntryPath, entrypointPath, afterEntryPath] = metaData.endpoints.beep.methods.get.entrypoint;
    assert.equal(beforeEntryPath.split('/boring').pop(), '/src/lib/init-hooks/core-hooks/react/dynamicComponents/beforeEntry.js');
    assert.equal(entrypointPath.split('/boring').pop(), '/src/client/pages/1/entrypoint.js');
    assert.equal(afterEntryPath.split('/boring').pop(), '/src/lib/init-hooks/core-hooks/react/dynamicComponents/afterEntry.js');

    assert.equal(metaData.endpoints.beep.methods.get.reactEntry[0].reactRoot,  '1');
    assert.ok(injection.boring.react, 'should have pushed an object onto boring');
    done();
  });
});
