const Emitter = require('eventemitter2').EventEmitter2;
const injectoreStore = require('./injecture-store');

const registerDefaults = {
  attributes: {},
  silent: false,
  singleton: false,
  mapInstances: false,
  instanceIndexField: null,
  interfaces: [],
  factoryArgs: [],
  factoryContext: {},
};

function addToInstanceStore(key, instance, instanceIndexField) {

  const {
    instances,
  } = injectoreStore[key];

  // by default they key will just be an auto incrementing number
  // to make it look like an array.
  let index = Object.keys(instances).length;
  if (instanceIndexField) {
    index = instance[instanceIndexField];
  }
  instances[index] = instance;
}

class Injecture {

  constructor() {
    const emitter = new Emitter({wildcard: true});
    // eslint-disable-next-line guard-for-in
    for (const field in emitter) {
      this[field] = emitter[field];
    }

    this.get = this.create;
    this.reducers = {};
  }

  create(key, ...factoryArgs) {
    const {
      factory, options, instances,
    } = injectoreStore[key];

    if (!factory) return undefined;

    if (options.singleton && Object.keys(instances).length === 1) {
      return instances[Object.keys(instances)[0]];
    }

    // eslint-disable-next-line prefer-rest-params
    const args = Array.prototype.slice.call(arguments).length > 1 ?
      factoryArgs : options.factoryArgs;
    const instance = factory.apply(options.factoryContext, args);

    // singletons have to be registered
    if (options.singleton || options.mapInstances) {
      addToInstanceStore(key, instance, options.instanceIndexField);
    }

    options.interfaces.forEach(interfaceType => {

      if (typeof interfaceType === 'string') {
        interfaceType = {
          type: interfaceType,
          mapInstances: false,
          instanceIndexField: null,
        };
      };

      if (interfaceType.mapInstances) {
        addToInstanceStore(interfaceType.type, instance, interfaceType.instanceIndexField);
      }
    });
    return instance;
  }

  /**
   * This will wrap register
   * by providing a default Class factory
   *
   * @param {*} key
   * @param {*} Klass
   * @param {*} options
   */
  registerClass(Klass, options) {
    this.registerClassByKey(Klass.name, Klass, options);
  }

  /**
   * This will wrap register
   * by providing a default Class factory
   *
   * @param {*} key
   * @param {*} Klass
   * @param {*} options
   */
  registerClassByKey(key, Klass, options = {attributes: {}}) {

    this.register(key, function classFactor() {
      return new Klass();
    }, options);
  }

  register(key, factory, options) {
    options = Object.assign({}, registerDefaults, options);
    if (injectoreStore[key]) {
      // kinda harsh but we really need to stricly enforce
      // this.  Better blow up at design / testing time
      // rather than have strange errors crop up over time
      throw new Error(`The factory ${key} is already registered`);
    }
    injectoreStore[key] = {
      factory,
      options,
      instances: {},
    };
    options.interfaces.forEach(interfaceType => {
      // convert to a string
      if (interfaceType.type) interfaceType = interfaceType.type;
      if (!injectoreStore[interfaceType]) {
        injectoreStore[interfaceType] = {
          instances: {},
          keys: [],
        };
      }

      // keep a reverse mapping
      injectoreStore[interfaceType].keys.push(key);

    });
    if (!options.silient) {
      this.emit(`register.${key}`, key, factory, options);
    }

  }

  allInstances(key) {
    if (!injectoreStore[key]) return [];

    return Object.keys(injectoreStore[key].instances).map(index => {
      return injectoreStore[key].instances[index];
    });

  }

  getKeysByInterface(interfaceType) {
    const interfaces = injectoreStore[interfaceType] || {};
    const reducers = this.reducers[interfaceType] || [defaultReducer];

    const keys = interfaces.keys.map(key => {
      return {key, options: injectoreStore[key].options};
    });

    return reducers.reduce((newKeys, reducer) => {
      return reducer(newKeys);
    }, keys).map(keyObj => keyObj.key);
  }

  addReducers(...reducers) {
    reducers.forEach(reducerObj => {
      this.addReducer(reducerObj.key, reducerObj.reducer);
    });
  }

  addReducer(key, reducer) {
    if (!this.reducers[key]) this.reducers[key] = [];
    this.reducers[key].push(reducer);
  }
}

function defaultReducer(keys) {
  return keys;
}

const injectureSingleton = new Injecture();

module.exports = injectureSingleton;
