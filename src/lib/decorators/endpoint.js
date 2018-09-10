
import merge from 'deepmerge'
import EventEmitter from 'eventemitter2'

const extenrnalEmitters = [];
const localEmitter = new EventEmitter({wildcard: true});

localEmitter.on('decorator.endpoint.*', function(...args) {
  const eventName = this.event;
  extenrnalEmitters.forEach(emitter => {
    emitter.emit.apply(emitter, [eventName].concat(args))
  });
});

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
        get: descriptor.value
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