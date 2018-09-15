const compose = require('compose-middleware').compose
const staticInjectionMiddleware = require('./staticInjectionMiddleware');
const createWebpackStack = require('./createWebpackStack');

module.exports = function(BoringInjections) {
  
  const {
    boring
  } = BoringInjections;

  boring.before('init-routers', function() {

    boring.app.use(createWebpackStack(BoringInjections));

    // let everything else keep booting up, we will
    // queue until webpackStack resolves 
    return Promise.resolve();
  });

  boring.before('http::get', function(ctx) {
    if (ctx.get.entrypoint) {
      staticInjectionMiddleware(ctx.res, ctx.get);
    }

    return Promise.resolve();
  });
  

  return {name: 'boring-webpack'}
}