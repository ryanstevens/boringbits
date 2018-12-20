const boringPackageJSON = require('../../../package.json');

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
      'tsc': 'npx boring type-check',
      'type-check': 'npm run tsc',
      'up': 'npx boring up',
      'down': 'npx boring down',
      'debug': 'npx boring debug',
      'prepublishOnly': 'npm run build',
    },
  };

  // Extend or create package.json file in destination path
  this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);


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
