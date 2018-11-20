
import merge from 'deepmerge';
import EventEmitter from 'eventemitter2';

const injecture = require('injecture');

const extenrnalEmitters = [];
const localEmitter = new EventEmitter({wildcard: true});

const toExport = {};


/**
 * We will use this DI container
 * to track all the classes instantiated
 * via a @endpoint decorator
 */

localEmitter.on('decorator.router.*', function routerEvents(...args) {
  // eslint-disable-next-line no-invalid-this
  const eventName = this.event;
  const nameWithArgs = [eventName].concat(args);

  // TODO: future enhancement, ensure ALL events
  // always emit for each external emitter.
  // This way emitters will ALWAYS get every endpoint
  // reguardless of when it was subscribed
  extenrnalEmitters.forEach(emitter => {
    emitter.emit.apply(emitter, nameWithArgs);
  });
});

/**
 * This "data structure" is to
 * hold a map of all the class prototypes
 * so we can store a shawod copy of the
 * decorated functionns meta data.
 *
 * It is an array because the only way to do
 * lookups on the decorated classes is to
 * compare prototypes, which cannot be converted
 * to a string so nothing will ever be ordered.
 *
 * This okay because although decorators are
 * evaulated at runtime, there should NOT
 * be that many in the code base where this
 * becauses non-performant as the vast majoirty
 * of use cases do not create decorated
 * classes on the fly.
 */
const classPrototypes = [];

// eslint-disable-next-line valid-jsdoc
/**
 * by desing, if there is no classs registered
 * then it will make a new metadata obj and push it
 * in the classPrototypes array
 * @param {*} proto
 */
function getShadowMetaData(proto) {
  for (let i=0; i<classPrototypes.length; i++) {
    if (classPrototypes[i].proto === proto) return classPrototypes[i];
  }

  const newProto = {
    proto,
    metadata: {},
  };
  classPrototypes.push(newProto);
  return newProto;
}

toExport.getMetaDataByClass = function getMetaDataByClass(Klass) {
  return getShadowMetaData(Klass.prototype);
};

// deep merge... what could go wrong
function addToProps(proto, val) {
  const oldmetadata = getShadowMetaData(proto).metadata;
  const newMetadata = merge(oldmetadata, val);
  getShadowMetaData(proto).metadata = newMetadata;
  return newMetadata;
}


toExport.middleware = function middleware(middleware) {
  if (typeof middleware === 'string') middleware = [middleware];

  return function decorator(target, field, descriptor) {
    const endpoint = {};
    endpoint[field] = {
      methods: {
        get: {
          handler: descriptor.value,
        },
      },
      middleware,
    };
    const classMetadata = addToProps(target, {
      endpoints: endpoint,
    });
    localEmitter.emit('decorator.router.middleware', {
      target,
      middleware,
      field,
      descriptor,
      classMetadata,
    });
    return descriptor;
  };
};

toExport.get = function get(path) {
  // convert to array
  return function decorator(target, field, descriptor) {
    const endpoint = {};
    endpoint[field] = {
      methods: {
        get: {
          path,
          handler: descriptor.value,
        },
      },
    };
    const classMetadata = addToProps(target, {
      endpoints: endpoint,
    });
    localEmitter.emit('decorator.router.get', {
      target,
      path,
      field,
      descriptor,
      classMetadata,
    });
    return descriptor;
  };
};

toExport.post = function post(path) {
  // convert to array
  return function decorator(target, field, descriptor) {
    const endpoint = {};
    endpoint[field] = {
      methods: {
        post: {
          path,
          handler: descriptor.value,
        },
      },
    };
    const classMetadata = addToProps(target, {
      endpoints: endpoint,
    });
    localEmitter.emit('decorator.router.post', {
      target,
      path,
      field,
      descriptor,
      classMetadata,
    });
    return descriptor;
  };
};

createEndpointDecorator('entrypoint', 'get');

injecture.register('decorator.router.endpoint',
    // since we are only using the container
    // to collect all the instances we give it a
    // dummy factory
    function endpointFactor(Klass) {
      return Klass;
    }, {
      map_instances: true,
    }
);


toExport.endpoint = function endpoint(path = '') {
  return function(target) {
    const endpointMetaData = {path};
    const classMetadata = addToProps(target.prototype, endpointMetaData);

    injecture.create('decorator.router.endpoint', target);
    localEmitter.emit('decorator.router.endpoint', {
      target,
      path,
      classMetadata,
    });
    return target;
  };
};

toExport.subscribeDecorators = function subscribeDecorators(emitter) {
  extenrnalEmitters.push(emitter);
};

function createEndpointDecorator(decoratorName, method, descriptorWrapper) {

  if (!descriptorWrapper) {
    descriptorWrapper = function defaultDescriptorWrapper(descriptor) {
      return descriptor;
    };
  }

  toExport[decoratorName] = function newDecorator(...args) {
    return function decorateHandler(target, field, descriptor) {

      const decoratedDescriptor = descriptorWrapper(descriptor);
      const endpoint = {};
      endpoint[field] = {
        methods: {},
      };

      ['get', 'post', 'put', 'delete', 'head'].forEach(method => {

        endpoint[field].methods[method] = {
          handler: decoratedDescriptor.value,
        };
        endpoint[field].methods[method][decoratorName] = args;

      });

      const classMetadata = addToProps(target, {
        endpoints: endpoint,
      });
      const objToEmit = {
        target,
        field,
        decoratedDescriptor,
        classMetadata,
      };
      objToEmit[decoratorName] = args;
      localEmitter.emit('decorator.router.'+decoratorName, objToEmit);
      return decoratedDescriptor;
    };
  };
}

toExport.createEndpointDecorator = createEndpointDecorator;

module.exports = toExport;
