const url = require('url');

module.exports = function(BoringInjections) {

  const {
    boring,
    logger,
    config,
  } = BoringInjections;

  boring.before('add-hooks', function() {

    boring.before('app.use', function(ctx) {
      if (ctx.name === 'context') {
        boring.app.use('http-logger', function loggerMiddleware(req, res, next) {

          const parsedUrl = url.parse(req.originalUrl);
          const path = (parsedUrl.pathname || '').toLowerCase();
          const ext = path.split('.').pop();
          const logLevel = (path.indexOf('_hmr')>0 ||
                            ext.endsWith('map') ||
                            ext.endsWith('js') ||
                            ext.endsWith('ico') ||
                            ext.endsWith('css') ||
                            ext.endsWith('jpg') ||
                            ext.endsWith('jpeg') ||
                            ext.endsWith('png') ||
                            ext.endsWith('gif')) ? 'trace' : 'info';

          const objToLog = {
            path,
            method: req.method,
          };

          if (config.get('boring.logUserAgent', true)) {
            objToLog.userAgent = req.headers['user-agent'];
          }

          logger[logLevel](objToLog, 'http-request');
          next();
        });
      }
      return Promise.resolve();
    });

    return Promise.resolve();
  });

  return {name: 'http-logger'};
};
