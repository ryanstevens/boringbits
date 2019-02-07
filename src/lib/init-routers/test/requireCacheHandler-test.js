const moduleGraph = require('../requireCacheHandler').moduleGraph;
const assert = require('assert');

describe.only('requireCacheHandler', function() {

  it('has a filled cache', done => {

    assert(Object.keys(moduleGraph).length > 0);

    assert(Object.keys(moduleGraph).reduce((total, key) => {
      return moduleGraph[key].dependants.length + total;
    }, 0) > 0, 'Each key should have a dependants array');

    done();
  });

  it('cache will increase when require is called', async () => {

    const numKeys = Object.keys(moduleGraph).length;
    assert(moduleGraph[__dirname + '/test-mods/foo'] === undefined);
    require('./test-mods/bar');
    // console.log(Object.keys(moduleGraph).sort());
    assert.equal((numKeys + 2), Object.keys(moduleGraph).length);
    assert(moduleGraph[__dirname + '/test-mods/foo'].dependants.length == 1);
    assert.deepEqual(
      moduleGraph[__dirname + '/test-mods/foo'].dependants[0],
      moduleGraph[__dirname + '/test-mods/bar']
    );

  });

});
