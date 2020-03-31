#!/usr/bin/env node

import program from 'commander';
import input from '@inquirer/input';
import password from '@inquirer/password';
import keytar from 'keytar';
import { startWork, stopWork } from './holded';
import { Routes } from './routes';
const packageJSON = require('../package.json'); // eslint-disable-line

function executeCli({ email, company, password }) {
  const routes = Routes({ business: company });

  program.version(packageJSON.version);

  program
    .command('start')
    .description('writes into the holded the time')
    .action(function () {
      startWork({ email, password }, routes);
    });

  program
    .command('stop')
    .description('updates holded time with the time')
    .action(function () {
      stopWork({ email, password }, routes);
    });

  program.parse(process.argv);
}

async function questions() {
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
