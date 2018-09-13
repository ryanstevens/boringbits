const assert = require('assert');
const decorators = require('../endpoint');
const logger = require('boring-logger');

const { endpoint, get, middleware, post, client} = decorators


describe.only('Endpoint decorator', function() {

  it('will push a prop into the class prototype', done => {

    @endpoint('/foo')
    class Meow {

      @get('/beep')
      bark() {

      }

      @get('/boop') 
      meow() {

      }
    }

    assert.equal(Meow.prototype.__decorated_props.path, '/foo');
    assert.equal(Meow.prototype.__decorated_props.endpoints.bark.methods.get.handler, Meow.prototype.bark);
    assert.equal(Meow.prototype.__decorated_props.endpoints.meow.methods.get.handler, Meow.prototype.meow);
    done();
  });

  
  it('will combine annotations into the __decorated_props', done => {

    @endpoint('/bar')
    class Meow {

      @get('/beep')
      @middleware('meep')
      @client('foo_client.js')
      screetch() {

      }

      @post('/beep')
      stopper() {

      }
    }

    assert.equal(Meow.prototype.__decorated_props.endpoints.screetch.middleware[0], 'meep');
    assert.equal(Meow.prototype.__decorated_props.endpoints.screetch.path, '/beep');
    assert.equal(Meow.prototype.__decorated_props.endpoints.screetch.methods.get.handler, Meow.prototype.screetch);
    assert.equal(Meow.prototype.__decorated_props.endpoints.screetch.methods.get.entry_point, 'foo_client.js')
    assert.equal(Meow.prototype.__decorated_props.endpoints.stopper.methods.post.handler, Meow.prototype.stopper);
    done();
  });


});