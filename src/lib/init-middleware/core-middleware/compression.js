const compression = require('compression');
const decorators = require('../../decorators');
const config = require('boring-config');

module.exports = function boringInection(boring) {


  decorators.router.createEndpointDecorator('compress');

  boring.before('add-middleware', function() {
    boring.after('app.use', function(ctx) {
      if (ctx.name === 'parsers') {
        boring.app.use('compression', boring.middleware.compression);
      }
    });
  });

  return compression({
    filter: (req, res) => {
      if (config.get('boring.compression', false) === false) return false;
      return compression.filter(req, res);
    },
  });
};
