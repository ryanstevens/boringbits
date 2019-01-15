/* eslint-disable no-invalid-this */
'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

const containerGenerator = {
  BaseContainer: async function(container, fileName) {
    if (!fileName) fileName = container.className + '.js';

    this.fs.copyTpl(
      this.templatePath('containers/'+container.className + '.js'),
      this.destinationPath(`src/client/pages/${this.props.pageName}/containers/${fileName}`),
      Object.assign({}, this.props, container),
    );
  },
  CatContainer: async function(container) {
    containerGenerator.BaseContainer.call(this, container, `CatContainer/index.js`);

    ['cat1', 'cat2', 'cat3', 'cat4'].forEach(fileName => {
      this.fs.copy(
        this.templatePath(`containers/${fileName}.jpg`),
        this.destinationPath(`src/client/pages/${this.props.pageName}/containers/CatContainer/${fileName}.jpg`)
      );
    });

  },
  MessageContainer: async function(container) {
    containerGenerator.BaseContainer.call(this, container);
  },
};


module.exports = class extends Generator {

  constructor(args, options) {
    super(args, options);

    this.props = this.options.props;
    this.processPrompt = this.options.processPrompt;
  }

  async prompting() {

    console.log('\n\n****************************');
    await this.processPrompt({
      type: 'list',
      name: 'pageType',
      message: 'What type of component do you want to generate',
      choices: [
        {name: chalk.bold('The Works:') +'   Universally rendered page using React / Redux / React Router with automagic route configuration', value: 'redux'},
        {name: chalk.bold('Bare bones:') +'  simple page with just server and single empty(ish) client entrypoint', value: 'bareBones'},
        {name: chalk.bold('Container:') + '   A React view container to plug into a pre-existing page', value: 'container'},
      ],
    });

    await this.processPrompt({
      type: 'input',
      name: 'pageName',
      message: 'What is the name of the route you want to make',
      default: 'demo',
    });

    await this.processPrompt({
      type: 'input',
      name: 'path',
      message: 'What is the url path',
      default: '/demo',
    });

    this.props.pageName = this.props.pageName.replace(/\s+/g, '-');
    this.props.className = this.props.pageName.charAt(0).toUpperCase() + this.props.pageName.substring(1);

    if (this.props.pageType === 'redux') {
      this.props.containers = [
        {
          className: 'MessageContainer',
          path: this.props.path,
        },
        {
          className: 'CatContainer',
          path: this.props.path + '/cats',
        },
      ];
    }

  }

  async writing() {

    if (this.props.pageType === 'bareBones') {
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
    } else if (this.props.pageType === 'redux') {
      this.fs.copyTpl(
        this.templatePath('reduxRoute.js'),
        this.destinationPath(`src/server/routers/${this.props.pageName}.js`),
        this.props
      );

      // this.fs.copyTpl(
      //   this.templatePath('reduxApp.js'),
      //   this.destinationPath(`src/client/pages/${this.props.pageName}/App.js`),
      //   this.props
      // );

      this.fs.copyTpl(
        this.templatePath('reduxReducers.js'),
        this.destinationPath(`src/client/pages/${this.props.pageName}/reducers/index.js`),
        this.props
      );


      this.fs.copyTpl(
        this.templatePath('decoratorAppChrome.js'),
        this.destinationPath(`src/client/pages/${this.props.pageName}/decorators/AppChrome.js`),
        this.props
      );


      this.props.containers.forEach(container => {

        containerGenerator[container.className].call(this, container);

      });
    }
  }

};
