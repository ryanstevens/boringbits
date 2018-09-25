
import merge from 'deepmerge'
import EventEmitter from 'eventemitter2'

const extenrnalEmitters = [];
const localEmitter = new EventEmitter({wildcard: true});

/**
 * We will use this DI container
 * to track all the classes instantiated
 * via a @endpoint decorator
 */
const injecture = require('injecture');

localEmitter.on('decorator.router.*', function(...args) {
  const eventName = this.event;
  const name_with_args = [eventName].concat(args);

  // TODO: future enhancement, ensure ALL events
  // always emit for each external emitter.
  // This way emitters will ALWAYS get every endpoint
  // reguardless of when it was subscribed
  extenrnalEmitters.forEach(emitter => {
    emitter.emit.apply(emitter, name_with_args)
  });
});

/***
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
  for (let i=0; i<class_prototypes.length; i++) {
    if (class_prototypes[i].proto === proto) return class_prototypes[i]
  }

  const newProto = {
    proto,
    metadata: {}
  };
  class_prototypes.push(newProto);
  return newProto;

}

export function getMetaDataByClass(Klass) {
  return getShadowMetaData(Klass.prototype);
}

// deep merge... what could go wrong
function addToProps(proto, val){
  const oldmetadata = getShadowMetaData(proto).metadata
  const newMetadata = merge(oldmetadata, val);
  getShadowMetaData(proto).metadata = newMetadata;
  return newMetadata;
}


export function middleware(middleware) {
  if (typeof middleware === 'string') middleware = [middleware];

  return function decorator(target, field, descriptor) {

    let endpoint = {}
    endpoint[field] = {
      methods : {
        get: {
          handler: descriptor.value
        }
      },
      middleware
    }
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
  }
}   


export function get(path) {
  //convert to array
  return function decorator(target, field, descriptor) {

    let endpoint = {}
    endpoint[field] = {
      methods : {
        get: {
          handler: descriptor.value
        }
      },
      path
    }
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
  }
}   

export function post(path) {
  //convert to array
  return function decorator(target, field, descriptor) {
    let endpoint = {}
    endpoint[field] = {
      methods : {
        post: {
          handler: descriptor.value
        }
      },
      path
    }
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
  }
}   

/**
 * 
 * @param {absolute path from root} entrypoint
 */
export function entrypoint(js_file_path) {
  return function decorator(target, field, descriptor) {
    let endpoint = {}
    endpoint[field] = {
      methods : {
        get: {
          entrypoint: js_file_path,
          handler: descriptor.value
        }
      }
    }
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
  }
}


injecture.register('decorator.router.endpoint', 
  // since we are only using the container
  // to collect all the instances we give it a
  // dummy factory
  function endpointFactor(Klass) {
    return Klass
  }, { 
    map_instances: true
  }
);


export function endpoint(path = '') {
  return function (target) {
    const endpoint_meta_data = { path }
    const class_metadata = addToProps(target.prototype, endpoint_meta_data);

    injecture.create('decorator.router.endpoint', target);
    localEmitter.emit('decorator.router.endpoint', {
      target,
      path,
      class_metadata
    });
    return target;
  }
}

export function subscribeDecorators(emitter) {
  extenrnalEmitters.push(emitter);
}