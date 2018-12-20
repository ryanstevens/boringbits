'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

module.exports = class extends Generator {
  initializing() {

    const options = {
      props: {},
      processPrompt,
    };

    const prompt = this.prompt.bind(this);

    async function processPrompt(promptObj, context, propToMerge) {
      const answers = await prompt(promptObj);

      if (!context) {
        context = options;
      }
      if (!propToMerge) propToMerge = 'props';

      Object.assign(context[propToMerge], answers);
      return context[propToMerge];
    }

    this.composeWith(require.resolve('../server'), options);
    this.composeWith(require.resolve('../page'), options);
  }

  async prompting() {

    // Have Yeoman greet the user.
    this.log('\n\nWelcome to the very exciting '+
      `${chalk.red('boringbits')} generator!\n\n`);

  }
};
