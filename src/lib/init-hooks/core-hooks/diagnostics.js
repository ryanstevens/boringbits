
module.exports = function({boring} = BoringInjections) {

  const {
    logger,
    config,
    decorators,
  } = boring;

  const {
    router,
    get,
  } = decorators.router;

  boring.after('add-hooks', function() {

    if (config.get('boring.disableDiagnostics', true) === false) {

      @router('/__diagnostics')
      class Dianostics {

        @get('*')
        get(req, res) {
          const timeout = req.query.timeout || 0;

          setTimeout(() => {
            res.json({
              headers: req.headers,
              query: req.query,
              timeout: timeout,
            });
          }, timeout);
        }
      }

    }

    return Promise.resolve();

  });

  return {name: 'diagnostics'};
};
