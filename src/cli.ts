#!/usr/bin/env node

import program from 'commander';
import input from '@inquirer/input';
import password from '@inquirer/password';
import keytar from 'keytar';
import { holded } from './holded';

function executeCli({ email, company, password }) {
  program
    .version('0.1.0')
    .option('-s, --start', 'Start work')
    .option('-k, --stop', 'Stop work')
    .parse(process.argv);

  holded(
    { email, company, password },
    {
      start: program.start,
      stop: program.stop
    }
  );
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
