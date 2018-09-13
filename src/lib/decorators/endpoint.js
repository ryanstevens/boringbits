
import merge from 'deepmerge'
import EventEmitter from 'eventemitter2'

const extenrnalEmitters = [];
const localEmitter = new EventEmitter({wildcard: true});

localEmitter.on('decorator.endpoint.*', function(...args) {
  const eventName = this.event;
  // TODO: future enhancement, ensure ALL events
  // always emit for each external emitter.
  // This way emitters will ALWAYS get every endpoint
  // reguardless of when it was subscribed
  extenrnalEmitters.forEach(emitter => {
    emitter.emit.apply(emitter, [eventName].concat(args))
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

function addToProps(proto, val){
  if (!proto.__decorated_props) proto.__decorated_props = {};
  let prev = proto.__decorated_props|| {};
  proto.__decorated_props = merge(prev, val);
}

export function middleware(middleware) {
  if (typeof middleware === 'string') middleware = [middleware];
  return function(target, field, descriptor) {
    let endpoint = {}
    endpoint[field] = {
      func : descriptor.value,
      middleware
    }
    addToProps(target, {
      endpoints: endpoint
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
    addToProps(target, {
      endpoints: endpoint
    });
    localEmitter.emit('decorator.endpoint.get', {
      target,
      path,
      field,
      descriptor
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
    addToProps(target, {
      endpoints: endpoint
    });
    localEmitter.emit('decorator.endpoint.post', {
      target,
      path,
      field,
      descriptor
    });
    return descriptor;
  }
}   

/**
 * 
 * @param {absolute path from root} entry_point
 */
export function client(entry_point) {
  return function decorator(target, field, descriptor) {
    let endpoint = {}
    endpoint[field] = {
      methods : {
        get: {
          entry_point,
          handler: descriptor.value
        }
      }
    }
    addToProps(target, {
      endpoints: endpoint
    });
    localEmitter.emit('decorator.endpoint.client', {
      target,
      entry_point,
      field,
      descriptor
    });
    return descriptor;
  }
}


export function endpoint(path = '') {
  return function (target) {
    addToProps(target.prototype, { path });
    localEmitter.emit('decorator.endpoint.endpoint', {
      target,
      path
    });
    return target;
  }
}

export function subscribeDecorators(emitter) {
  extenrnalEmitters.push(emitter);
}