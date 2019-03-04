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

    const beepInstance1 = injecture.get('Beep');
    assert.equal(beepInstance1.peep(), 'hi');

    const beepInstance2 = injecture.get('Beep');
    assert.ok(beepInstance1 !== beepInstance2, 'shows classes are are not singletons by default');

  });

  it('can register a signleton', async () => {

    const initDeocrators = require('../index');
    const injections = {};

    const decorators = await initDeocrators(injections);

    const registerSingleton = decorators.injecture.registerSingleton;

    @registerSingleton
    class Boop {

    }

    const boopInstance1 = injecture.get('Boop');
    const boopInstance2 = injecture.get('Boop');

    assert.ok(boopInstance1 === boopInstance2);

  });
});
