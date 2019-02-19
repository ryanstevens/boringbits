
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
    disable_cache: true,
    buildModuleGraph: true,
  },
  logUserAgent: false,
  disableDiagnostics: false,
  docker: {
    infrastructure: {
      haproxy: true,
      mysql: false,
      dynamodb: false,
      redis: false,
    },
  },
};
