"use strict";

const healthy = require('healthy');

const os = require('os');

const moment = require('moment');

module.exports = function (BoringInjections) {
  const {
    boring,
    config
  } = BoringInjections;
  const {
    HealthCheck,
    HealthModel
  } = healthy;
  const healthCheck = new HealthCheck({}, {
    started: new Date(),
    hostname: os.hostname(),
    pid: process.pid
  });

  healthCheck.model.serialize = function () {
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
    asyncCheck: function (cb) {
      const heap = getHeap();
      Object.keys(heap).forEach(key => {
        memoryHealth.set(key, heap[key]);
      });
      cb();
    }
  });
  const requestData = {
    total: {
      cnt: 0
    }
  };
  const requestHealth = new HealthModel(requestData);
  healthCheck.addChildCheck('memory', memoryHealth);
  healthCheck.addChildCheck('requests', requestHealth);
  boring.before('add-hooks', function () {
    boring.before('app.use', function (ctx) {
      if (ctx.name === 'boring-session') {
        const healthyMiddleware = healthCheck.createMiddleware();

        function healthyMiddlewareCntWrapper(req, res, next) {
          requestData.total.cnt++;
          healthyMiddleware(req, res, next);
        }

        boring.app.use('healthy', healthyMiddlewareCntWrapper);
      }

      return Promise.resolve();
    });
    return Promise.resolve();
  });
  return {
    name: 'healthy'
  };
};
//# sourceMappingURL=healthy.js.map