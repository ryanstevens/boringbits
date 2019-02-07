import staticInjectionMiddleware from './staticInjectionMiddleware';
import createWebpackStack, {webpackDone} from './createWebpackStack';

module.exports = function webpackHook(BoringInjections) {
  const {boring} = BoringInjections;

  boring.before('init-routers', function beforeInitRouters() {
    boring.after('app.use', function(ctx) {
      if (ctx.name === 'compression') {
        boring.app.use('webpack', createWebpackStack(BoringInjections));
      }
    });

    BoringInjections.webpackDone = webpackDone;

    // let everything else keep booting up, we will
    // queue until webpackStack resolves
    return Promise.resolve();
  });

  boring.before('http::get', function(ctx) {
    if (ctx.get.entrypoint) {
      staticInjectionMiddleware(ctx.res, ctx.get.entrypoint);
    }

    return Promise.resolve();
  });

  return {name: 'boring-webpack'};
};
