const babel = require('./babelCompiler');

module.exports = {
  process: function process(src, filename, config, transformOptions) {
    return babel(src, {targetNode: true});
  },
};
