const assert = require('assert');
const proxyquire = require('proxyquire');
const logger = require('boring-logger');
const connect = require('../connect_express');

describe('Connect Express', function() {


  it('will install endpoint verbs from JSON', function(done) {

    const handlers = {};
    function collectHandler(method) {
      return function(path, handler) {
        handlers[path+ ':' + method] = handler
      }
    }

    function handlerFooGet() {}
    function handlerFooPost() {}
    function handlerBeepPost() {}
    function handlerBeepHead() {}
    
    const routes = {
      pageA: {
        path: '/meow',
        endpoints: [
          {
            path: '/foo',
            methods: {
              get: handlerFooGet,
              post: {
                handler: handlerFooPost
              }
            }
          }
        ]
      },
      pageB: {
        endpoints: [
          {
            path: '/beep',
            methods: {
              post: handlerBeepPost,
              head: handlerBeepHead
            }
          }
        ]
      }
    }

    const mockExpressApp = {
      get: collectHandler('get'),
      post: collectHandler('post'),
      head: collectHandler('head')
    }

    connect(mockExpressApp, routes.pageA);
    assert.equal(Object.keys(handlers).length, 2, 'The get handler should have ran')
    assert.ok(handlers['/meow/foo:get'] === handlerFooGet, 'Problem registering the handler into express for /foo :GET')
    assert.ok(handlers['/meow/foo:post'] === handlerFooPost, 'Problem registering the handler into express for /foo :POST')
    connect(mockExpressApp, routes.pageB);
    assert.equal(Object.keys(handlers).length, 4)
    assert.ok(handlers['/beep:post'] === handlerBeepPost, 'Problem registering the handler into express for /beep :POST')
    assert.ok(handlers['/beep:head'] === handlerBeepHead, 'Problem registering the handler into express for /beep :HEAD')
    done();

  });

});