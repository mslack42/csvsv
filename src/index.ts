#!/usr/bin/env node
import {Command} from 'commander';
import {initQuery} from './init-query/init-query.js';
import {runQuery} from './run-query/run-query.js';
import chalk from 'chalk';
import {TOOL_VERSION} from './build/version.js';

process.on('uncaughtException', (err: Error) => {
  console.error(chalk.red('Something went wrong. '+
  'This may indicate various things, for example a file system error or a misconfigured query file.'));
  process.exit(1);
});

const program = new Command();
program
    .version(TOOL_VERSION, '-v, --vers', 'output the current version')
    .description('Tool for programmatically extracting data from a CSV');

program
    .command('run')
    .description('Run a configured query against a CSV')
    .option('-d, --data <filepath>', 'CSV filepath', './data.csv')
    .option('-o, --output <directory path>', 'output directory', './csvsv')
    .option('-q, --query <filepath>', 'query filepath', './query.js')
    .option('-l, --logs <filename>', 'error log filename', 'error-logs.txt')
    .action(runQuery);

program
    .command('init')
    .description('Create a template query.json')
    .option('-w, --with-docs', 'flag to include docs in query file', false)
    .option('-n, --name <name>', 'query name', 'query.js')
    .action(initQuery);

program.parse();
