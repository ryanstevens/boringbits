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
                            ext.endsWith('svg') ||
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
          const _end = res.end;
          let ended;
          const hrstart = process.hrtime();

          res.end = function end(chunk, encoding) {
            if (ended) {
              return false;
            }

            const hrend = process.hrtime(hrstart);
            logger[logLevel]({
              ...objToLog,
              respTime: Math.round((hrend[0] * 1000) + hrend[1] / 1000000),
            }, 'http-request-end');
            ended = true;
            return _end.call(this, chunk, encoding);
          };

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
