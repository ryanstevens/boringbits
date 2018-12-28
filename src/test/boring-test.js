const assert = require('assert');

describe('Boring entrypoint', function() {

  this.timeout(5000);

  it('should export server', function() {

    const boring = require('../boring');

    assert.ok(boring);
    assert.ok(boring.Server);
    const server = new boring.Server();
    assert.ok(server.start);
    assert.ok(server.config);
  });

});
