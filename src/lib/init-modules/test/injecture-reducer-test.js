const assert = require('assert');
const injectureDeps = require('../core-modules/injecture-reducers');

describe('Injecture strategy reducers', function() {

  it('will reduce an interface to one key by config', async () => {

      const injecture = require('injecture');
      const config = {
        get: function(key) {
          if (key === 'boring.strategies') return {
            'animal' : 'ClassDog',
            'car': 'ClassFord'
          };
          if (key === 'strategies') return {
            'car': 'ClassChevy',
            'computer': 'ClassMac'
          }
        }
      }
      injectureDeps({
        injecture,
        config
      });

      injecture.registerClass( class ClassChevy {
        constructor() {
        }
      }, {
        interfaces: ['car'],
        singleton: true,
      });

      injecture.registerClass( class ClassFord {
        constructor() {
        }
      }, {
        interfaces: ['car'],
        singleton: true,
      });

      injecture.registerClass( class ClassGM {
        constructor() {
        }
      }, {
        interfaces: ['car'],
        singleton: true,
      });

      injecture.registerClass( class ClassDog {
        constructor() {
        }
      }, {
        interfaces: ['animal'],
        singleton: true,
      });


      injecture.registerClass( class ClassCat {
        constructor() {
        }
      }, {
        interfaces: ['animal'],
        singleton: true,
      });

      const carKey = injecture.getKeysByInterface('car');
      assert.equal(carKey.length, 1);
      assert.equal(carKey[0], 'ClassChevy');


      const animalKey = injecture.getKeysByInterface('animal');
      assert.equal(animalKey.length, 1);
      assert.equal(animalKey[0], 'ClassDog');

  });
});