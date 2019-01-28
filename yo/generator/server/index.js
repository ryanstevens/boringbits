'use strict';
const Generator = require('yeoman-generator');
const copyConfigs = require('./copyConfigs');
const makeApp = require('./makeApp');


module.exports = class extends Generator {
  constructor(args, options) {
    super(args, options);
    this.options = options;

    this.props = this.options.props;
    this.processPrompt = this.options.processPrompt;
  }

  async prompting() {

    if (this.props.scope === 'project') {
      await this.processPrompt({
        type: 'input',
        name: 'projectName',
        message: 'What is the name of project',
        default: this.appname, // Default to current folder name
      });

      this.props.projectName = this.props
        .projectName.replace(/\s+/g, '-').toLowerCase();
    }

  }

  async writing() {
    if (this.props.scope === 'project') {
      await copyConfigs.call(this);
      await makeApp.call(this);
    }
  }

};
