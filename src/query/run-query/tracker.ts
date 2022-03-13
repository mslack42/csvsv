import chalk from 'chalk';
import CliOptions from './../../cli-options.js';
import {RunQueryOpts} from './../../data/opts/run-query-opts.js';

export default class Tracker {
  private static instance: Tracker;

  private includedRows: number = 0;
  public totalRows: number = 0;
  private errorCount: number = 0;

  private constructor() {

  }

  public static getInstance() {
    if (!Tracker.instance) {
      Tracker.instance = new Tracker();
    }
    return Tracker.instance;
  }

  public incrementCounts = (included: boolean) => {
    this.totalRows++;
    if (included) this.includedRows++;
  };

  public incrementErrorCount = () => {
    this.errorCount++;
  };

  public logSummary = () => {
    let logFn = console.log;
    if (this.errorCount > 0) {
      logFn = (log: string) => console.log(chalk.red(log));
    }

    const cli = CliOptions.getInstance();
    const cliOptions: RunQueryOpts = cli.options;
    const outputDirectory = cliOptions.output;
    const errorLogName = cliOptions.logs;

    logFn(`Query Complete`);
    logFn(`Total rows: ${this.totalRows}`);
    logFn(`Included rows: ${this.includedRows}`);
    logFn(`Errors: ${this.errorCount}`);
    if (this.errorCount > 0) {
      logFn(`See ${errorLogName} in ${outputDirectory} for error details`);
      logFn(`Other outputs in ${outputDirectory} may not be accurate`);
    } else {
      logFn(`See ${outputDirectory} for output`);
    }
  };
}
