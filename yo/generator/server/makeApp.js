
module.exports = async function makeApp() {

  this.fs.copyTpl(
      this.templatePath('server/app.js'),
      this.destinationPath('src/server/app.js'),
      this.props
  );
};
