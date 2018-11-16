// This file exists because
// we want to limit side effects
// of running config values set
// either in development or production

module.exports = {
  isDevelopment: true,
  useWebpackDevServer: false,
  foo: {
    bar: 'overriden',
    baz: 'meep',
  },
  boring: {
    paths: {
      base_app_path: 'src',
      boring_app_path: 'src',
    },
    hooks: {
      healthy: {
        interval: 0,
      },
    },
  },
};

