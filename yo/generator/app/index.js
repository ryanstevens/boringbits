'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(`\n\nWelcome to the very exciting ${chalk.red('generator-boring')} generator!\n\n`);

    const answers = await this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname, // Default to current folder name
    }]);

    this.log('app name', answers.name);
  }

  writing() {
    // console.log(this.props);
    // this.fs.copy(
    //     this.templatePath('dummyfile.txt'),
    //     this.destinationPath('dummyfile.txt')
    // );
  }

  install() {

  }
};
