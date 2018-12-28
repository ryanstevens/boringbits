const cls = require('boring-cls');
const uuid = require('node-uuid');

module.exports = function(BoringInjections) {

  const {
    boring,
  } = BoringInjections;

  boring.before('add-hooks', function() {

    const ns = cls.getNamespace('http-request');
    boring.after('app.use', function(ctx) {
      if (ctx.name === 'healthy') {
        boring.app.use('context', function contextMiddleware(req, res, next) {

          ns.bindEmitter(req);
          ns.bindEmitter(res);

          ns.run(() => {
            req.corrId = uuid.v4();
            ns.set('corrId', req.corrId);
            next();
          });
        });
      }
      return Promise.resolve();
    });

    return Promise.resolve();
  });

  return {name: 'context'};
};
