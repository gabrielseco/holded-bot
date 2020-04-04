#!/usr/bin/env node

const packageJSON = require('../package.json'); // eslint-disable-line
import program from 'commander';
import input from '@inquirer/input';
import password from '@inquirer/password';
import keytar from 'keytar';
import { startWork, stopWork } from './holded';
import { Routes } from './routes';

interface ExecuteCliArgs {
  email: string;
  company: string;
  password: string;
}

function executeCli({ email, company, password }: ExecuteCliArgs): void {
  const routes = Routes({ business: company });

  program.version(packageJSON.version);

  program.option('-debug, --debug', 'Debug puppeteer');

  program
    .command('start')
    .description('writes into the holded the time')
    .option('-t, --time <time>', 'You can add the exact time here')
    .action(function (options) {
      startWork({ email, password }, routes, {
        debug: program.debug,
        time: options.time
      });
    });

  program
    .command('stop')
    .description('updates holded time with the time')
    .option('-t, --time <time>', 'You can add the exact time here')
    .action(function (options) {
      stopWork({ email, password }, routes, {
        debug: program.debug,
        time: options.time
      });
    });

  program.parse(process.argv);
}

interface QuestionArgs {
  companyQuestion: string;
  emailQuestion: string;
  passwordQuestion: string;
}

async function questions(): Promise<QuestionArgs> {
  const companyQuestion = await input({ message: 'Enter your company name' });
  const emailQuestion = await input({ message: 'Enter your email' });
  const passwordQuestion = await password({
    message: 'Enter your password',
    mask: '*'
  });

  return { companyQuestion, emailQuestion, passwordQuestion };
}

keytar.findCredentials('holdedbot').then(credentials => {
  if (credentials.length === 0) {
    questions().then(answers => {
      keytar
        .setPassword(
          'holdedbot',
          `${answers.emailQuestion}-${answers.companyQuestion}`,
          answers.passwordQuestion
        )
        .then(() => {
          executeCli({
            email: answers.emailQuestion,
            company: answers.companyQuestion,
            password: answers.passwordQuestion
          });
        });
    });
  }

  if (credentials.length > 0) {
    const { account, password } = credentials[0];

    const [email, company] = account.split('-');

    executeCli({
      email,
      company,
      password
    });
  }
});
