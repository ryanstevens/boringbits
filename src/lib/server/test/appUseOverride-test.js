
const appUse = require('../appUseOverride');
const Understudy = require('boring-understudy');
const assert = require('assert');


describe('appUseOverride', function() {

  it('will wrap app.use and is immediately invokeable', function(done) {

    const middleware = [];
    const originalUse = function(fn) {
      middleware.push(fn);
    }
    const express = {
      use: originalUse,
    };

    Understudy.call(express);

    express.use = appUse(express, express.perform);
    assert.notStrictEqual(originalUse, express.use);

    let syncCounter = 0;
    express.use(function(req, res, next) {
      syncCounter++;
      next();
    });

    assert.equal(middleware.length, 1);

    middleware[0]({}, {}, () => {
    });
    setTimeout(() => {
      assert.equal(syncCounter, 1, 'middleware should have been ran');
      done();

    }, 20);

  });


  it('will queue middleware calls until all before hooks are ran', function(done) {

    const middleware = [];
    const originalUse = function(fn) {
      middleware.push(fn);
    };
    const express = {
      use: originalUse,
    };

    Understudy.call(express);

    express.use = appUse(express, express.perform);
    assert.notStrictEqual(originalUse, express.use);

    express.before('app.use', function(ctx) {
      assert.equal(ctx.name, 'middlwareA', 'ensure name of middleware in ctx is name of funciton');

      return new Promise(function(resolve, reject) {
        setTimeout(resolve, 300);
      });
    });

    let syncCounter = 0;
    express.use('middlwareA', function middlwareA(req, res, next) {
      syncCounter++;
      next();
    });
    assert.equal(middleware.length, 1);

    // run middleware
    middleware[0]({}, {}, () => {});
    assert.equal(syncCounter, 0, 'middleware should not have been ran');

    setTimeout(() => {
      assert.equal(syncCounter, 0, 'middleware should not have been ran, even after the event loop is done');
    }, 0);

    setTimeout(() => {
      assert.equal(syncCounter, 0, 'middleware should not have been ran, even after some time but before the promise resovles');
    }, 100);

    setTimeout(() => {
      assert.equal(syncCounter, 1, 'middleware should have been ran');
      done();
    }, 400);


  });

});
