"use strict";

var _deepmerge = _interopRequireDefault(require("deepmerge"));

var _eventemitter = _interopRequireDefault(require("eventemitter2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const injecture = require('injecture');

const extenrnalEmitters = [];
const localEmitter = new _eventemitter.default({
  wildcard: true
});
const toExport = {
  middleware: {}
};
/**
 * We will use this DI container
 * to track all the classes instantiated
 * via a @endpoint decorator
 */

localEmitter.on('decorator.router.*', function routerEvents(...args) {
  // eslint-disable-next-line no-invalid-this
  const eventName = this.event;
  const nameWithArgs = [eventName].concat(args); // TODO: future enhancement, ensure ALL events
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

const class_prototypes = [];
/**
 * by desing, if there is no classs registered
 * then it will make a new metadata obj and push it
 * in the class_prototypes array
 * @param {*} proto
 */

function getShadowMetaData(proto) {
  for (let i = 0; i < class_prototypes.length; i++) {
    if (class_prototypes[i].proto === proto) return class_prototypes[i];
  }

  const newProto = {
    proto,
    metadata: {}
  };
  class_prototypes.push(newProto);
  return newProto;
}

toExport.getMetaDataByClass = function getMetaDataByClass(Klass) {
  return getShadowMetaData(Klass.prototype);
}; // deep merge... what could go wrong


function addToProps(proto, val) {
  const oldmetadata = getShadowMetaData(proto).metadata;
  const newMetadata = (0, _deepmerge.default)(oldmetadata, val);
  getShadowMetaData(proto).metadata = newMetadata;
  return newMetadata;
}

toExport.middleware = function middleware(middleware) {
  if (typeof middleware === 'string') middleware = [middleware];
  return function decorator(target, field, descriptor) {
    let endpoint = {};
    endpoint[field] = {
      methods: {
        get: {
          handler: descriptor.value
        }
      },
      middleware
    };
    const class_metadata = addToProps(target, {
      endpoints: endpoint
    });
    localEmitter.emit('decorator.router.get', {
      target,
      middleware,
      field,
      descriptor,
      class_metadata
    });
    return descriptor;
  };
};

toExport.get = function get(path) {
  //convert to array
  return function decorator(target, field, descriptor) {
    let endpoint = {};
    endpoint[field] = {
      methods: {
        get: {
          handler: descriptor.value
        }
      },
      path
    };
    const class_metadata = addToProps(target, {
      endpoints: endpoint
    });
    localEmitter.emit('decorator.router.get', {
      target,
      path,
      field,
      descriptor,
      class_metadata
    });
    return descriptor;
  };
};

toExport.post = function post(path) {
  //convert to array
  return function decorator(target, field, descriptor) {
    let endpoint = {};
    endpoint[field] = {
      methods: {
        post: {
          handler: descriptor.value
        }
      },
      path
    };
    const class_metadata = addToProps(target, {
      endpoints: endpoint
    });
    localEmitter.emit('decorator.router.post', {
      target,
      path,
      field,
      descriptor,
      class_metadata
    });
    return descriptor;
  };
};
/**
 *
 * @param {absolute path from root} entrypoint
 */


toExport.entrypoint = function entrypoint(js_file_path) {
  return function decorator(target, field, descriptor) {
    let endpoint = {};
    endpoint[field] = {
      methods: {
        get: {
          entrypoint: js_file_path,
          handler: descriptor.value
        }
      }
    };
    const class_metadata = addToProps(target, {
      endpoints: endpoint
    });
    localEmitter.emit('decorator.router.entrypoint', {
      target,
      entrypoint,
      field,
      descriptor,
      class_metadata
    });
    return descriptor;
  };
};

injecture.register('decorator.router.endpoint', // since we are only using the container
// to collect all the instances we give it a
// dummy factory
function endpointFactor(Klass) {
  return Klass;
}, {
  map_instances: true
});

toExport.endpoint = function endpoint(path = '') {
  return function (target) {
    const endpoint_meta_data = {
      path
    };
    const class_metadata = addToProps(target.prototype, endpoint_meta_data);
    injecture.create('decorator.router.endpoint', target);
    localEmitter.emit('decorator.router.endpoint', {
      target,
      path,
      class_metadata
    });
    return target;
  };
};

toExport.subscribeDecorators = function subscribeDecorators(emitter) {
  extenrnalEmitters.push(emitter);
};

toExport.addMiddlewareDecorator = function addMiddlewareDecorator(name, func) {
  toExport.middleware[name] = func;
};

module.exports = toExport;
//# sourceMappingURL=router.js.map