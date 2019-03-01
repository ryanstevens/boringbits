const assert = require('assert');
const injecture = require('injecture');

describe('Injecture decorators', function() {

  it('can use register decorator', async () => {

    const initDeocrators = require('../index');
    const injections = {};

    const decorators = await initDeocrators(injections);

    assert.ok(decorators.router.router);
    assert.ok(decorators.injecture.register);

    const register = decorators.injecture.register;

    @register()
    class Beep {
      peep() {
        return 'hi';
      }
    }

    const beepInstance = injecture.get('Beep');
    assert.equal(beepInstance.peep(), 'hi');

  });
});
