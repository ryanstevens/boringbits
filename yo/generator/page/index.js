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
      type: 'list',
      name: 'pageType',
      message: 'What type of page do you want to generate',
      choices: [
        {name: 'Bare bones: simple page with just webpack configured entrypoint', value: 'bareBones'},
        {name: 'React / Redux: Universal rendering of react using redux and react router', value: 'redux'},
      ],
    });


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
        this.templatePath('bareBonesRoute.js'),
        this.destinationPath(`src/server/routers/${this.props.pageName}.js`),
        this.props
    );

    this.fs.copyTpl(
        this.templatePath('bareBonesEntrypoint.js'),
        this.destinationPath(`src/client/pages/${this.props.pageName}/entrypoint.js`),
        this.props
    );
  }

};
