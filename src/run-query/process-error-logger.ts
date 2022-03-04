import {createWriteStream, WriteStream} from 'fs';
import {join} from 'path';
import CliOptions from '../cli-options.js';
import {RunQueryOpts} from '../data/opts/run-query-opts.js';
import {Debug} from '../data/query/configuration/debug.js';
import {KnownError} from '../errror/known-error.js';
import Tracker from './tracker.js';

export default class ProcessErrorLogger {
  private static instance: ProcessErrorLogger;

  private logsPath: string;
  private logWriter: WriteStream;
  private configuration: Debug;

  private constructor(logsPath: string) {
    this.logsPath = logsPath;
  }

  public static getInstance() {
    if (!ProcessErrorLogger.instance) {
      const cli: RunQueryOpts = CliOptions.getInstance().options;
      const logsPath = join(cli.output, cli.logs);

      ProcessErrorLogger.instance = new ProcessErrorLogger(logsPath);
    }
    return ProcessErrorLogger.instance;
  }

  public logError = (text: string, exception: Error) => {
    Tracker.getInstance().incrementErrorCount();

    if (!this.logWriter) {
      this.logWriter = createWriteStream(
          this.logsPath,
          {autoClose: true},
      ).on('error', () => {
        throw new KnownError(`Something went wrong whilst trying to write error logs to ${this.logsPath}`);
      });
    }

    this.logWriter.write(`${text} (See data row #${Tracker.getInstance().totalRows})`);
    this.logWriter.write('\n');
    if (this.configuration.showUglyStackTracesOnError) {
      this.logWriter.write(exception.stack);
      this.logWriter.write('\n');
    }
  };

  public close = () => {
    if (this.logWriter) this.logWriter.close();
  };
}
