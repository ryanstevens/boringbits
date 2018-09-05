
const paths = require('paths');
const requireInject = require('require-inject-all');
const logger = require('boring-logger');

module.exports = async function initRoutes(boring) {

  return new Promise((resolve, reject) => {
    requireInject(paths.serverEndpoints, {})
      .then(moduleData => {
        Object.keys(moduleData).forEach(moduleName => {
          const route = moduleData[moduleName];
          // don't blow up if the endpoint structure isn't quite right
          route.endpoints.forEach((endpoint = {path: '/___default___', methods: {}}) => {

            // don't blow up if there are no methods
            const methods = endpoint.methods || {};
            Object.keys(methods).forEach(method => {
              boring.app[method](endpoint.path, endpoint.methods[method]);
            });       
            logger.info(`Installed route ${moduleName}, path ${endpoint.path}`); 
          });
        });

        resolve(moduleData)
      })
  });
}