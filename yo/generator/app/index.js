const Generator = require('yeoman-generator');
const chalk = require('chalk');
const fs = require('fs-extra');
const childProcess = require('child_process');

module.exports = class extends Generator {
  initializing() {

    const options = {
      props: {},
      processPrompt,
    };

    this.props = options.props;
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

    this.processPrompt = processPrompt;

    this.composeWith(require.resolve('../server'), options);
    this.composeWith(require.resolve('../page'), options);
    this.composeWith(require.resolve('../deploy'), options);
  }

  async prompting() {
    const borings = chalk.red('boringbits');

    // Have Yeoman greet the user.
    this.log(`

${chalk.yellow(`************************************************************`)}
${chalk.yellow(`**                                                        **`)}
${chalk.yellow(`**   ${chalk.white(`Welcome to the very exciting`)} ${borings} ${chalk.white(`generator!`)}   **`)}
${chalk.yellow(`**                                                        **`)}
${chalk.yellow(`************************************************************`)}


    `);


    await this.processPrompt({
      type: 'list',
      name: 'scope',
      message: 'What do you want to generate?',
      choices: [
        {name: 'Scaffold an entire boring app', value: 'project'},
        {name: 'Add a component', value: 'component'},
        {name: 'Make boring app deployable', value: 'deploy'},
      ],
    });

    try {
      this.props.packageJSON = require(process.cwd() + '/package.json');
    } catch (e) {
      this.props.packageJSON = {};
    }

  }


  async install() {
    this.log(`

  **********************************
    Files successuflly generated!

    `);

    if (fs.existsSync(process.cwd() + '/package-lock.json')) {
      fs.unlinkSync(process.cwd() + '/package-lock.json');
    }

    await this.processPrompt({
      type: 'checkbox',
      name: 'scripts',
      message: 'What do you want to do now?',
      choices: [
        {
          name: 'npm install',
          value: 'install',
          checked: !fs.existsSync(process.cwd() + '/node_modules/boringbits'),
        },
        {
          name: 'npm start',
          value: 'start',
          checked: true,
        },
      ],
    });

    if (this.props.scripts.indexOf('install')>=0) {
      childProcess.spawnSync('npm', ['install'], {
        stdio: [process.stdin, process.stdout, process.stderr],
        cwd: process.cwd(),
      });
    }

    if (this.props.scripts.indexOf('start')>=0) {
      this.spawnCommand('npx', ['boring', 'start', '--url', 'https://www.boringlocal.com' + this.props.path]);
    }
  }

};
