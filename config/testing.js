// This file exists because
// we want to limit side effects
// of running config values set
// either in development or production

module.exports = {
  use_webpack_dev_server: false,
  foo: {
    bar: 'overriden',
    baz: 'meep'
  },
  boring: {
    paths: {
      base_app_path: 'src'
    },
    hooks: {
      healthy: {
        interval: 0,
      }
    }
  }
}