const assert = require('assert');

describe('Injecture', function() {

  const injecture = require('../index');

  it('will register a factory by key', done => {

    injecture.register('classA', function() {
      return 'A';
    });

    assert.equal(injecture.create('classA'), 'A');
    done();
  });

  it('will use a default factory for a class', done => {

    class ClassB {
      constructor() {
        this.foo = 'bar';
      }
    }

    injecture.registerClassByKey('class_b', ClassB, {});
    assert.equal(injecture.get('class_b').foo, 'bar');
    done();
  });

  it('will call the factory with context and args from options', done => {

    injecture.register('class_c', function(...args) {

      assert.deepEqual(args, ['foo', 'bar']);
      // eslint-disable-next-line no-invalid-this
      assert.deepEqual(this.hello, 'there');
      done();

    }, {factoryArgs: ['foo', 'bar'], factoryContext: {hello: 'there'}});

    injecture.create('class_c');

  });

  it('will map instances by key field', done => {

    class ClassD {
      constructor(name) {
        this.name = name;
      }
    }

    injecture.register('class_d', function(name) {
      return new ClassD(name);
    }, {
      mapInstances: true,
      instanceIndexField: 'name',
    });

    const instance1 = injecture.create('class_d', 'ryan');
    const instance2 = injecture.create('class_d', 'stevens');

    const instances = injecture.allInstances('class_d');

    assert.equal(instance1, instances[0]);
    assert.equal(instance2, instances[1]);
    assert.equal(instances.length, 2);

    done();
  });


  it('will map instances by interface', done => {

    class ClassE {
      constructor(name) {
        this.name = name;
      }
      msg() {
        return 'hi' + this.name;
      }
    }
    class ClassF {
      constructor(name) {
        this.name = name;
      }
      msg() {
        return 'there' + this.name;
      }
    }
    class ClassG {
      constructor(name) {
        this.name = name;
      }
      msg() {
        return 'there' + this.name;
      }
    }

    injecture.register('ClassE', function(name) {
      return new ClassE(name);
    }, {
      interfaces: [{
        type: 'msg',
        mapInstances: true,
      }],
    });
    injecture.register('ClassF', function(name) {
      return new ClassF(name);
    }, {
      interfaces: [{
        type: 'msg',
        mapInstances: true,
      }],
    });

    injecture.register('ClassG', function(name) {
      return new ClassG(name);
    }, {
      interfaces: [{type: 'msg'}],
    });

    const instance1 = injecture.create('ClassE', 'ryan');
    const instance2 = injecture.create('ClassF', 'stevens');
    const instance3 = injecture.create('ClassG', 'stives');

    const instances = injecture.allInstances('msg');

    assert.equal(instance1, instances[0]);
    assert.equal(instance2, instances[1]);
    assert.equal(instances.length, 2);

    done();
  });


  it('can ask for class keys by interface', done => {

    injecture.registerClass( class ClassH {
      constructor() {
      }
    }, {
      interfaces: ['test1'],
    });

    injecture.registerClass( class ClassI {
      constructor() {
      }
    }, {
      interfaces: ['test1'],
    });

    injecture.registerClass( class ClassJ {
      constructor() {
      }
    }, {
      interfaces: ['abc', 'test1'],
    });

    const keys = injecture.getKeysByInterface('test1');

    assert.equal(keys[0], 'ClassH');
    assert.equal(keys[1], 'ClassI');
    assert.equal(keys[2], 'ClassJ');
    assert.equal(keys.length, 3);

    done();
  });

  it('will enforce singletons', done => {
    let ctr =0;
    injecture.registerClass( class ClassK {
      constructor() {
        this.ctr = ++ctr;
      }
    }, {
      singleton: true,
    });

    assert.equal(injecture.get('ClassK').ctr, 1, 'First get');
    assert.equal(injecture.get('ClassK').ctr, 1, 'second get');
    assert.equal(injecture.get('ClassK').ctr, 1, 'third get');
    assert.equal(ctr, 1);
    done();
  });

  it('can add reducers to supply logic how get the right interface', (done) => {

    injecture.addReducers({
      key: 'bar',
      reducer: function reducer(keys) {
        return keys.filter(key => key.key === 'ClassL');
      },
    });

    injecture.registerClass( class ClassL {
      constructor() {
      }
    }, {
      interfaces: ['bar'],
      singleton: true,
    });

    injecture.registerClass( class ClassM {
      constructor() {
      }
    }, {
      interfaces: ['bar'],
      singleton: true,
    });

    const keys = injecture.getKeysByInterface('bar');
    assert.equal(keys.length, 1);
    assert.equal(keys[0], 'ClassL');

    done();
  });
});
