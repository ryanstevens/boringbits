const boringPackageJSON = require('../../../package.json') || {};
const fs = require('fs-extra');

module.exports = async function() {

  const pkgJson = {
    name: this.options.props.projectName,
    version: '1.0.0',
    dependencies: {
      boringbits: '^' + boringPackageJSON.version,
    },
    scripts: {
      'start': 'npx boring start',
      'build': 'npm run build-node && npm run build-client',
      'build-node': 'npx boring build-node',
      'build-client': 'npx boring build-client',
      'build-static': 'npx boring build-static',
      'deploy': 'npx boring deploy',
      'tsc': 'npx boring type-check',
      'type-check': 'npm run tsc',
      'up': 'npx boring up',
      'down': 'npx boring down',
      'debug': 'npx boring debug',
      'yo': 'npx boring yo',
      'generate': 'npx boring generate', // yo and generae are the same
      'prepublishOnly': 'npm run build',
    },
  };

  // Extend or create package.json file in destination path

  this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);


  let desitinationPackageJson = {};
  if (fs.existsSync(this.destinationPath('package.json'))) {
    desitinationPackageJson = require(this.destinationPath('package.json'));
  }

  // we're not monsters, if people already has
  // an eslint config then all good we'll just move on
  if (!fs.existsSync(this.destinationPath('.eslintrc.js'))
    && !fs.existsSync(this.destinationPath('.eslintrc.json'))
    && !('eslintConfig' in desitinationPackageJson) ) {
    this.fs.copyTpl(
      this.templatePath('config/.eslintrc.js'),
      this.destinationPath('.eslintrc.js'),
      this.options.props
    );
  }


  if (!fs.existsSync(this.destinationPath('.tsconfig.json'))) {
    this.fs.copyTpl(
      // just grab the one in boring itself
      this.templatePath('../../../../tsconfig.json'),
      this.destinationPath('tsconfig.json'),
      this.options.props
    );
  }

  /**
   * Copy configs
   */
  this.fs.copyTpl(
    this.templatePath('config/default.js'),
    this.destinationPath('config/default.js'),
    this.options.props
  );
  this.fs.copyTpl(
    this.templatePath('config/development.js'),
    this.destinationPath('config/development.js'),
    this.options.props
  );
  this.fs.copyTpl(
    this.templatePath('config/staging.js'),
    this.destinationPath('config/staging.js'),
    this.options.props
  );
  this.fs.copyTpl(
    this.templatePath('config/production.js'),
    this.destinationPath('config/production.js'),
    this.options.props
  );

};
