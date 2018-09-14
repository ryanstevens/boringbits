
import paths from 'paths';
import requireInject from 'require-inject-all';
import logger from 'boring-logger'
import endpoint_transformer from './transform-annotation'
import * as decorators from '../decorators'
import injecture from 'injecture'
import Understudy from 'boring-understudy'


module.exports = async function initRoutes(BoringInjections) {

  const {
    boring
  } = BoringInjections;

  boring.decorators = decorators;
  
  const endpoint_meta = [];

  /**
   * !IMPORTANT!
   * 
   * First, we *must* subscribe the decorators to boring's 
   * event emitter.  This way we will know all the classes
   * used by the @endpoint decorator.  THEN we can 
   * use requireInject to actually require the files 
   */
  boring.on('decorator.endpoint.endpoint', function(eventData){
    
    const metadata= decorators.endpoint.getMetaDataByClass(eventData.target).metadata
    endpoint_meta.push(endpoint_transformer(metadata));
  });
  boring.decorators.subscribeDecorators(boring);

  /**
   * Now we just took care of any future enpoints, 
   * let's grab all of the endpoints defined before 
   * this point in the boot sequence, such as middleware
   */
  const instances = injecture.allInstances('decorator.endpoint.endpoint');

  instances.forEach(Klass => {
    const metadata= decorators.endpoint.getMetaDataByClass(Klass).metadata
    endpoint_meta.push(endpoint_transformer(metadata));
  });

  
  const moduleData = await requireInject([paths.boring_endpoints, paths.server_endpoints], boring)

  const route_descriptors = endpoint_meta.concat(Object.keys(moduleData).map(name => {
  
    const route = moduleData[name] || { endpoints: []};
    //If the route does not already have a name
    //then use the name of the module.  This object.name
    //will be added to the route_meta array 
    //and NOT guranteed to be unique.  The name
    //serves simply as an identifier in logging
    if (!route.name) route.name = name;

    return route;
  }));

  route_descriptors.forEach(route => {

    route.endpoints.forEach(endpoint => {

      const methods = endpoint.methods || {};
      Object.keys(methods).forEach(method => {
        wrapHandler(boring, route, endpoint, methods, method);
      });

    });

  })

  return route_descriptors;
}


// this is extracted from the code
// below to not enclose all the objects 
// within initRoutes.  These handlers 
// will be wrapped and always in the heap
function wrapHandler(boring, route, endpoint, methods, method) {
  
  // normalize data structure to match
  // decorator API
  if (typeof methods[method] === 'function') {
    const func = methods[method];
    methods[method] = {
      handler: func
    }
  }
  
  const handler = methods[method].handler;
  methods[method].handler = function wrappedHandler(req, res, next) {
    const ctx = {
      req, 
      res, 
      next, 
      route,
      endpoint,
      method
    };
    ctx[method] = methods[method];

    boring.perform('http::'+method.toLowerCase(), ctx, async function() {
      handler.call(this, ctx.req, ctx.res, ctx.next);
      return ctx;
    });

  };

}