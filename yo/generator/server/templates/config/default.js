/**
 * The default.js config file is used
 * by ALL environments regardless of
 * the value set to NODE_ENV. Any config
 * key overriden by an environments
 * configuration will be overriden, so
 * think of anything in this file as
 * "defaults".
 *
 * For example, we can set a default value
 * for the key foo.bar to "baz" like so
 * ```
 * {
 *   foo: {
 *      bar: 'baz',
 *   }
 * }
 * ```
 *
 * The value of `baz` will be set on all
 * enviornments.  If we wanted to override
 * the value of foo.bar to 'beep' in ONLY
 * production we would change production.js'
 * config file to
 * {
 *   foo: {
 *     bar: 'beep'
 *   }
 * }
 *
 * boring-config wraps node-config, please
 * refer to node-config's documentation for
 * more infomration on overriding values
 * in config files.
 * https://github.com/lorenwest/node-config
 */

module.exports = {
  envrionment: 'none-set',
  boring: {
    app: {
      // This value can be overriden by the evnironment variable PORT
      port: 5000,
    },
    logger: {
      name: '<%= projectName %>',
      level: 'info',
    },
  },
};
