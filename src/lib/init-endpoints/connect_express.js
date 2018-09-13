
const logger = require('boring-logger');

module.exports = function(express_app, route) {

  const routePath = route.path || '';
  route.endpoints.forEach((endpoint = {path: '', methods: {}}) => {
    
    // don't blow up if there are no methods
    const methods = endpoint.methods || {};
    Object.keys(methods).forEach(method => {
      let path = routePath + endpoint.path;
      let handler = endpoint.methods[method];
      // this IF checks to see
      // if handler is an object rather
      // than a function 
      if (handler.handler) handler = handler.handler
    
      express_app[method](path, handler);
      logger.info(`Installed {${method.toUpperCase()}} for path ${path}`); 
    });       
  });
  

}