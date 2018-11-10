
const URL = require('url');

module.exports = function domain_enforcer(BoringInjections) {

  const {
    boring
  } = BoringInjections;

  const subdomain = boring.config.get('boring.default_subdomain', 'www');

  if (subdomain) {
    boring.before('add-routers', function() {
      boring.app.use('redirector', function(req, res, next) {

        // reading protocol and hostname assumes
        // the proxy hook has ran to run the
        // express LOC `boring.app.set('trust proxy', true);`
        const protocol = req.protocol;
        const host = (req.hostname || '').toLowerCase();
        const hasSubdomain = (host.indexOf(subdomain) === 0);

        if (protocol === 'http' || !hasSubdomain) {
          const target = 'https://'  + (!hasSubdomain ? subdomain + '.' : '') + host + req.url;

          // this should probs be a 301,
          // but I don't like how agressive things
          // cache 301's ( looking >__> at your chrome)
          return res.redirect(302, target);
        }

        next();
      });

      return Promise.resolve();
    });
  }

  return {name: 'domain_enforcer'}
}