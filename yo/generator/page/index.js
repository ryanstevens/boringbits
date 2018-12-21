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
        {name: 'React / Redux / React Router: Universally rendered page with automagic route setup', value: 'redux'},
        {name: 'Bare bones: simple page with just server and single empty(ish) client entrypoint', value: 'bareBones'},
        {name: 'A React view container to plug into a pre-existing page', value: 'container'},
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

    if (this.props.pageType === 'redux') {
      this.props.containers = [
        {
          name: this.props.pageName + 'Container',
          path: this.props.path,
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

      this.fs.copyTpl(
          this.templatePath('reduxApp.js'),
          this.destinationPath(`src/client/pages/${this.props.pageName}/App.js`),
          this.props
      );

      this.fs.copyTpl(
          this.templatePath('reduxReducers.js'),
          this.destinationPath(`src/client/pages/${this.props.pageName}/reducers/index.js`),
          this.props
      );

      this.props.containers.forEach(container => {

        this.fs.copyTpl(
            this.templatePath('reduxContainer.js'),
            this.destinationPath(`src/client/pages/${this.props.pageName}/containers/${container}.js`),
            Object.assign({}, this.props, container),
        );

      });
    }
  }

};
