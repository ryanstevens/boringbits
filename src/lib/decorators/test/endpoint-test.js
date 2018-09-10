const assert = require('assert');
const decorators = require('../endpoint');
const logger = require('boring-logger');

const { endpoint, get, middleware} = decorators


describe('Endpoint decorator', function() {

  it('will push a prop into the class prototype', done => {

    @endpoint('/foo')
    class Meow {

      @get('/beep')
      bark() {

      }
    }

    assert.equal(Meow.prototype.__decorated_props.path, '/foo');
    assert.equal(Meow.prototype.__decorated_props.endpoints.bark.methods.get, Meow.prototype.bark);
    done();
  });

  
  it('will combine annotations into the __decorated_props', done => {

    @endpoint('/bar')
    class Meow {

      @get('/beep')
      @middleware('meep')
      screetch() {

      }
    }

    assert.equal(Meow.prototype.__decorated_props.endpoints.screetch.middleware[0], 'meep');
    assert.equal(Meow.prototype.__decorated_props.endpoints.screetch.path, '/beep');
    assert.equal(Meow.prototype.__decorated_props.endpoints.screetch.methods.get, Meow.prototype.screetch);
    done();
  });


});