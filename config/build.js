module.exports = {
  babel: {
    register_app: true,
  },
  paths: {
    base_app_path: 'src',
  },
  // this seems counter intuitive,
  // but even though we are building
  // code for production this mode
  // is not production as it's not being
  // ran on a prod server to customers
  isDevelopment: true,
};
