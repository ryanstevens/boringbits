const assert = require('assert');
const proxyquire = require('proxyquire');
const logger = require('boring-logger');
const paths = require('paths')

describe('Webpack-dev', function() {


  it('', function(done) {

      done();
  });

});

describe('Pathitize', function() {

  it('should convert jumk to a valid URL path', function() {

    const pathitize = require('../pathitize');
    assert.equal(pathitize('/foo/bar'), 'foo-bar');
    assert.equal(pathitize('foo/bar'), 'foo-bar');
    assert.equal(pathitize('foo/bar.js'), 'foo-bar');

    assert.equal(pathitize(paths.app_dir + '/beep/boop'), 'beep-boop', 'should have removed the app_dir prefix from path before cleaning');
  });
});