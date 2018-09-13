const compose = require('compose-middleware').compose
const staticInjectionMiddleware = require('./staticInjectionMiddleware');
const createWebpackStack = require('./createWebpackStack');

module.exports = function(BoringInjections) {
  
  const {
    boring
  } = BoringInjections;

  boring.after('init-hooks', function() {

    const webpackStack = createWebpackStack(BoringInjections)

    boring.app.use(function(req, res, next) {
  
      compose([
        webpackStack,
        staticInjectionMiddleware(boring)
      ])(req, res, next)

    });


    // let everything else keep booting up, we will
    // queue until webpackStack resolves 
    return Promise.resolve();
  });
  

  return {name: 'boring-webpack'}
}