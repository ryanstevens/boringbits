const moduleGraph = require('../requireGraph').moduleGraph;
const assert = require('assert');

describe('requireGraph', function() {

  it('has a filled cache', done => {

    assert(Object.keys(moduleGraph).length > 0);

    assert(Object.keys(moduleGraph).reduce((total, key) => {
      return moduleGraph[key].requiredBy.length + total;
    }, 0) > 0, 'Each key should have a requiredBy array');

    done();
  });

  it('cache will increase when require is called', async () => {
    const numKeys = Object.keys(moduleGraph).length;
    const dirname = __dirname.replace('boring/src', 'boring/dist').replace('boringbits/src', 'boringbits/dist');
    assert(moduleGraph[dirname + '/test-mods/foo'] === undefined);
    require('./test-mods/bar');

    // console.log(Object.keys(moduleGraph).sort());
    assert.equal((numKeys + 3), Object.keys(moduleGraph).length);
    assert.equal(moduleGraph[dirname + '/test-mods/foo'].requiredBy.length, 1);
    assert.equal(moduleGraph[dirname + '/test-mods/bar'].dependencies.length, 2);
    assert.deepEqual(
      moduleGraph[dirname + '/test-mods/foo'].requiredBy[0],
      moduleGraph[dirname + '/test-mods/bar']
    );

  });

});
