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
    const entryPoints= [
      'what/ever/which/that/foo_beforeEntry.js',
      process.cwd() +'/dist/lib/init-hooks/core-hooks/react/clientEntry.js',
      '/src/client/pages/demo/entrypoint.js',
      'what/ever/which/that/foo_afterEntry.js',
    ];

    const pathitize = require('../pathitize');
    assert.equal(pathitize(entryPoints), 'entry_demo');
  });

  it('can deal with objects passed into pathitize', function() {

    const entryPoints = [
      {canonicalPath: 'meow/foo/beep', assetPath: 'doesn not matter'},
      {canonicalPath: 'bark', assetPath: 'doesn not matter'},
    ];

    const pathitize = require('../pathitize');
    assert.equal(pathitize(entryPoints), 'meow-foo-beep_bark');
  });
});
