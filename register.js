/**
 * Will babelify a code base using
 * boring's presets.
 *
 * This is intended primarily for dev tasks
 * such as unit tests.  You should
 * generally not need to use this
 * in your main application during
 *
 * Usage Examples:
 *
 * - if (dev) require('boringbits/register');
 * - node node_modules/mocha/bin/_mocha  --require boringbits/register src/tests/my-test.js
 */

const nodeAppPath = require('./dist/node_modules/app-module-path');
nodeAppPath.addPath(process.cwd() + '/src');

require('./dist/babel_register');
