const assert = require('assert');
const paths = require('paths');


describe('Pathitize', function() {

  it('should convert jumk to a valid URL path', function() {

    const pathitize = require('../pathitize');
    assert.equal(pathitize('/foo/bar'), 'foo-bar');
    assert.equal(pathitize('foo/bar'), 'foo-bar');
    assert.equal(pathitize('foo/bar.js'), 'foo-bar');

    assert.equal(pathitize(paths.app_dir + '/beep/boop'), 'beep-boop', 'should have removed the app_dir prefix from path before cleaning');
  });

  it('should deal with arrays', function() {
    const entryPoints= [process.cwd() +'/dist/lib/init-hooks/core-hooks/react/clientEntry.js',
      '/src/client/pages/demo/entrypoint.js', ];

    const pathitize = require('../pathitize');
    assert.equal(pathitize(entryPoints), 'entry_demo');
  });
});