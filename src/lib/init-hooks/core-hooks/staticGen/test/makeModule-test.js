const makeModuleJson = require('../makeModulesJson');
const assert = require('assert');

describe('Make module-json', function() {


  it('Will create a object from list of required files', done => {

    const output = makeModuleJson.createJson(['beep/foo/zoop.js', 'beep/foo/bar.js', 'not_right_prefix/meow.js'], 'beep/');
    console.log(output);
    assert.equal(output.modulesCount, 1);
    assert.deepEqual(output.modules.foo, ['beep/foo/bar.js', 'beep/foo/zoop.js']);
    done();
  });
});
