#!/usr/bin/env node

import program from 'commander';

import { holded } from './holded';

program
  .version('0.1.0')
  .option('-s, --start', 'Start work')
  .option('-k, --stop', 'Stop work')
  .parse(process.argv);

holded({
  start: program.start,
  stop: program.stop
});
