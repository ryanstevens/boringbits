
module.exports = function(BoringInjections) {

  const {
    boring,
  } = BoringInjections;

  const disableDyno = boring.config.get('boring.hooks.headers.disableDyno', false);

  function headers(req, res, next) {
    if (!disableDyno) {
      res.setHeader('dyna-powered', '🦕');
    }
    next();
  }


  boring.before('add-hooks', function() {
    boring.app.disable('x-powered-by');

    boring.before('app.use', function(ctx) {
      if (ctx.name === 'boring-session') {
        boring.app.use('boring-headers', headers);
      }
      return Promise.resolve();
    });

    return Promise.resolve();
  });

  return {name: 'boring-headers'};
};
