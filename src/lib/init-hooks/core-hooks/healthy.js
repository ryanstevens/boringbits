const healthy = require('healthy');
const os = require('os');
const moment = require('moment');
const fs = require('fs');

module.exports = function(BoringInjections) {

  const {
    boring,
  } = BoringInjections;

  const {HealthCheck, HealthModel} = healthy;

  const buildStatsJson = process.cwd() + '/build/build-stats.json';
  const buildStats = fs.existsSync(buildStatsJson) ? require(buildStatsJson) : {};

  const healthCheck = new HealthCheck({
    baseRoute: '__health',
  }, {
    started: new Date(),
    hostname: os.hostname(),
    pid: process.pid,
    env: process.env.NODE_ENV || '-',
    ...buildStats,
  });

  healthCheck.model.serialize = function() {
    const healthObj = this.getHealthObject();
    healthObj.uptime = moment(healthObj.started).fromNow();
    return this.options.serializer(healthObj);
  };

  function getHeap() {
    const mem = process.memoryUsage();
    return Object.keys(mem).reduce((acc, key) => {
      acc[key] = Math.ceil(mem[key] / 1024 / 1024 * 100) / 100;
      return acc;
    }, {});
  }

  const memoryHealth = new HealthModel(getHeap(), {
    checkInterval: boring.config.get('boring.hooks.healthy.interval', 15000),
    asyncCheck: function(cb) {
      const heap = getHeap();
      Object.keys(heap).forEach(key => {
        memoryHealth.set(key, heap[key]);
      });
      cb();
    },
  });

  const requestData = {
    total: {
      cnt: 0,
      current: 0,
    },
  };

  const requestHealth = new HealthModel(requestData);

  function decrementCurrentReq() {
    requestData.total.current--;
  }

  healthCheck.addChildCheck('memory', memoryHealth);
  healthCheck.addChildCheck('requests', requestHealth);

  boring.before('add-hooks', function() {

    boring.before('app.use', function(ctx) {
      if (ctx.name === 'boring-session') {
        const healthyMiddleware = healthCheck.createMiddleware();
        function healthyMiddlewareCntWrapper(req, res, next) {
          requestData.total.cnt++;
          requestData.total.current++;

          const _end = res.end;
          let ended;
          res.end = function end(chunk, encoding) {
            if (ended) {
              return false;
            }

            requestData.total.current--;
            ended = true;
            return _end.call(this, chunk, encoding);
          };
          healthyMiddleware(req, res, next);
        }
        boring.app.use('healthy', healthyMiddlewareCntWrapper);
      }
      return Promise.resolve();
    });

    return Promise.resolve();
  });

  return {name: 'healthy'};
};
