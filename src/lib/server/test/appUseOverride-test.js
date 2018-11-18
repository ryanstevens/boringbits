
const appUse = require('../appUseOverride');
const Understudy = require('boring-understudy');
const assert = require('assert');


describe.only('appUseOverride', function() {

  it('will wrap app.use', function(done) {

    const originalUse = function(fn) {
      return 1;
    }
    const express = {
      use: originalUse
    }
    Understudy.call(express);

    const wrappedAppUse = appUse(express, express);

    assert.notStrictEqual(originalUse, wrappedAppUse);
    done();
  });

});