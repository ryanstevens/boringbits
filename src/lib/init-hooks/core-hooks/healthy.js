const HealthCheck = require('healthy').HealthCheck;

module.exports = function healthy(BoringInjections) {
  
  const {
    boring
  } = BoringInjections;

  const healthy = new HealthCheck({}, {
    started: new Date()
  });

  boring.before('add-hooks', function() {

    boring.before('app.use', function(ctx) {
      if (ctx.name === 'boring-session') {
        boring.app.use(healthy.createMiddleware());
      }
      return Promise.resolve();
    });
    
    return Promise.resolve();
  });

  

  return {name: 'healthy'}
}