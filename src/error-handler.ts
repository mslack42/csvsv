import chalk from 'chalk';
import CliOptions from './cli-options.js';
import {QueryOpts} from './data/opts/query-opts.js';
import {KnownError} from './errror/known-error.js';
import QueryWrapper from './run-query/query-wrapper.js';

export default class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {

  }

  public static getInstance() {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handleError = async (err: Error) => {
    if (err instanceof KnownError) {
      this.logFn(err.message);
    } else {
      this.logFn('Something went wrong, '+
        'and seeing this message means that this tool doesn\'t know what it was that broke. ' +
        'You could try using the --with-debug-logging argument to take a look at the error stack traces yourself.');
    }

    const opts: QueryOpts = CliOptions.getInstance().options;
    if (opts.withDebugLogging) {
      console.log(err.stack);
    }

    try {
      const query = await QueryWrapper.getInstance();
      query.close();
    } catch (err) {
      this.logFn('NOTE: An attempt was made to clear up any resources, but this may not have worked');
    }
    process.exit(1);
  };

  private logFn = (message: string) => console.log(chalk.red(message));
}
