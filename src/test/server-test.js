var assert = require('assert');


describe('Boring', function() {
  it('should export things', function() {
    const boring = require('../boring');
    assert.ok(boring);
  });
});