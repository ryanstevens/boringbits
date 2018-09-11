
import paths from 'paths'
import requireInject from 'require-inject-all'
import connectExpress from './connect_express'
import * as decorators from '../decorators';

module.exports = async function initRoutes(boring) {

  // expose decorators to app 
  boring.decorators = decorators;

  /**
   * !IMPORTANT!
   * 
   * First, we *must* subscribe the decorators to boring's 
   * event emitter.  This way we will know all the classes
   * used by the @endpoint decorator.  THEN we can 
   * use requireInject to actually require the files 
   */
  boring.decorators.subscribeDecorators(boring);
  boring.on('decorator.endpoint.endpoint', function(eventData){
    const Klass = eventData.target;
    
    const instance = new Klass();
    const class_props = instance.__decorated_props;
    // rewrite endpoints from an object into an array.
    class_props.endpoints = Object.keys(class_props.endpoints).map(name => {
      return class_props.endpoints[name];
    });
    connectExpress(boring.app, class_props);
  });


  return new Promise((resolve, reject) => {
    requireInject(paths.server_endpoints, boring)
      .then(moduleData => {
        Object.keys(moduleData).forEach(moduleName => {
          const endpoint = moduleData[moduleName];

          // If the module had no return value
          // or did not resolve a promise with a
          // value, we will move on as there will
          // be another pass for modules implementing
          // the @endpoint API
          if (endpoint === undefined) return

          // don't blow up if the endpoint structure isn't quite right
          connectExpress(boring.app, endpoint);

        });
        
        resolve(moduleData)
      })
  });
}