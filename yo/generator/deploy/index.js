/* eslint-disable no-invalid-this */
'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');


module.exports = class extends Generator {

  constructor(args, options) {
    super(args, options);

    this.props = this.options.props;
    this.processPrompt = this.options.processPrompt;
  }

  async prompting() {

    if (this.props.scope === 'deploy') {

      console.log('\n\n****************************');
      await this.processPrompt({
        type: 'list',
        name: 'deployment',
        message: 'Where do you want to deploy?',
        choices: [
          {name: chalk.bold('Lambda:') +'   Wraps your boring app in a AWS Lambda function', value: 'Lambda'},
          {name: chalk.bold('Now:') +'      Creates a dockerfile to deploy to Zeit\'s now', value: 'Now'},
          {name: chalk.bold('Heroku:        '), value: 'Heroku'},
        ],
      });
    }

  }

  async writing() {
    if (this.props.deployment) {
      if (this.props.deployment === 'Lambda') {

        this.fs.copyTpl(
          this.templatePath('handler.js'),
          this.destinationPath(`handler.js`),
          this.props
        );

        this.fs.copyTpl(
          this.templatePath('serverless.yml'),
          this.destinationPath(`serverless.yml`),
          this.props
        );

      } else {
        console.log(`
********************************************************

 Deployment \`${this.props.deployment}\` not supported yet

          `);
        process.exit(0);
      }
    }
  }

};
