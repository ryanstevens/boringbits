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

  const requestData = {
    cnt: 0
  }
  const requestHealth = new HealthModel(requestData, {
    checkInterval: 5000,
    asyncCheck: function(cb) {
      Object.keys(requestData).forEach(key => {
        requestHealth.set(key, requestData[key]);
      })
      cb();
    }
  });

  healthCheck.addChildCheck('memory', memoryHealth);
  healthCheck.addChildCheck('requests', requestHealth);

  boring.before('add-hooks', function() {

    boring.before('app.use', function(ctx) {
      if (ctx.name === 'boring-session') {
        const healthyMiddleware = healthCheck.createMiddleware();
        boring.app.use(function (req, res, next) {
          requestData.cnt++;
          healthyMiddleware(req, res, next);
        });
      }
      return Promise.resolve();
    });
    
    return Promise.resolve();
  });

  

  return {name: 'healthy'}
}