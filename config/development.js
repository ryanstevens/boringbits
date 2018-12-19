
module.exports = {
  babel: {
    node_target: '10.9.0',
    register_app: true,
  },
  isDevelopment: true,
  useWebpackDevServer: true,
  paths: {
    base_app_path: 'src',
  },
  server: {
    disable_cache: false,
  },
};
