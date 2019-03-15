
module.exports = {
  app: {
    port: 4000,
  },
  // meant to be overriden
  plugins: {
    'boring-plugins-default': {
      foo: 'bar',
    },
    'boring-plugins-last': {},
  },
  isDevelopment: false,
  useWebpackDevServer: false,
  logger: {
    name: 'boring-app',
    level: 'debug',
  },
  paths: {
    base_app_path: 'dist',
    boring_app_path: 'dist',
  },
  babel: {
    node_target: '10.9.0',
    register_app: false,
  },
  build: {
    staticgen: false,
  },
};

