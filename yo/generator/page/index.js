'use strict';
const Generator = require('yeoman-generator');


module.exports = class extends Generator {

  constructor(args, options) {
    super(args, options);

    this.props = this.options.props;
    this.processPrompt = this.options.processPrompt;
  }

  async prompting() {

    await this.processPrompt({
      type: 'input',
      name: 'pageName',
      message: 'What is the name of the route you want to make',
      default: 'home',
    });

    await this.processPrompt({
      type: 'input',
      name: 'path',
      message: 'What is the url path',
      default: '/',
    });

    this.props.pageName = this.props.pageName.replace(/\s+/g, '-');
    this.props.className = this.props.pageName.charAt(0).toUpperCase() + this.props.pageName.substring(1);
  }

  async writing() {

    this.fs.copyTpl(
        this.templatePath('page.js'),
        this.destinationPath(`src/server/routers/${this.props.pageName}.js`),
        this.props
    );

    this.fs.copyTpl(
        this.templatePath('app.js'),
        this.destinationPath(`src/client/pages/${this.props.pageName}/entrypoint.js`),
        this.props
    );
  }

};
