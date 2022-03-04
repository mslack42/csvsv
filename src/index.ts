#!/usr/bin/env node
import {Command, Option} from 'commander';
import {initQuery} from './init-query/init-query.js';
import {runQuery} from './run-query/run-query.js';
import {TOOL_VERSION} from './build/version.js';
import ErrorHandler from './error-handler.js';

process.on('unhandledRejection', (err: Error) => {
  ErrorHandler.getInstance().handleError(err);
});

process.on('uncaughtException', (err: Error) => {
  ErrorHandler.getInstance().handleError(err);
});

const program = new Command();
program
    .version(TOOL_VERSION, '-v, --vers', 'output the current version')
    .description('Tool for programmatically extracting data from a CSV')
    .showHelpAfterError(true);

program
    .command('run')
    .description('Run a configured query against a CSV')
    .option('-d, --data <filepath>', 'CSV filepath', './data.csv')
    .option('-o, --output <directory path>', 'output directory', './csvsv')
    .option('-q, --query <filepath>', 'query filepath', './query.js')
    .option('-l, --logs <filename>', 'error log filename', 'error-logs.txt')
    .addOption(new Option('--with-debug-logging', 'See stack traces').hideHelp())
    .action(runQuery);

program
    .command('init')
    .description('Create a template query.json')
    .option('-w, --with-docs', 'flag to include docs in query file', false)
    .option('-n, --name <name>', 'query name', 'query.js')
    .addOption(new Option('--with-debug-logging', 'See stack traces').hideHelp())
    .action(initQuery);

program.parse();
