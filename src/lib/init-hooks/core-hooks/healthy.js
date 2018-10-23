const healthy = require('healthy');
const os = require('os');

module.exports = function(BoringInjections) {
  
  const {
    boring
  } = BoringInjections;

  const {HealthCheck, HealthModel} = healthy;

  const healthCheck = new HealthCheck({}, {
    started: new Date(),
    hostname: os.hostname()
  });

  function getHeap() {
    const mem = process.memoryUsage();
    return Object.keys(mem).reduce((acc, key)  => {
      acc[key] = Math.ceil(mem[key] / 1024 / 1024 * 100) / 100;
      return acc;
    }, {});
  }

  const memoryHealth = new HealthModel(getHeap(), {
    checkInterval: 15000,
    asyncCheck: function(cb) {
      const heap = getHeap();
      Object.keys(heap).forEach(key => {
        memoryHealth.set(key, heap[key]);
      })
      cb();
    }
  });

  healthCheck.addChildCheck('memory', memoryHealth);

  boring.before('add-hooks', function() {

    boring.before('app.use', function(ctx) {
      if (ctx.name === 'boring-session') {
        boring.app.use(healthCheck.createMiddleware());
      }
      return Promise.resolve();
    });
    
    return Promise.resolve();
  });

  

  return {name: 'healthy'}
}