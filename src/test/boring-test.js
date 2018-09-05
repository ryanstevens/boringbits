var assert = require('assert');

describe('Boring entrypoint', function() {
  it('should export server', async function() {
    const boring = require('../boring');

    assert.ok(boring);
    assert.ok(boring.server);
    assert.ok(boring.config);
  });

});