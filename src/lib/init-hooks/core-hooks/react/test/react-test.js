const assert = require('assert');
const decorators = require('../../../../decorators');
const Understudy = require('boring-understudy');
const cls = require('boring-cls');

cls.createNamespace('http-request');

describe.only('React Tests', function reactTests() {

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
      get,
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
    assert.equal(beforeEntryPath.split('/boring').pop().split('/lib').pop(), '/init-hooks/core-hooks/react/dynamicComponents/dist/1_beforeEntry.js');
    assert.equal(entrypointPath.canonicalPath, '1');
    assert.equal(afterEntryPath.split('/boring').pop().split('/lib').pop(), '/init-hooks/core-hooks/react/dynamicComponents/dist/1_afterEntry.js');

    assert.equal(metaData.endpoints.beep.methods.get.reactEntry[0].reactRoot, '1');
    assert.ok(injection.boring.react, 'should have pushed an object onto boring');
    done();
  });
});
