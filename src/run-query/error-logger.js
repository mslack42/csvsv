import { createWriteStream } from 'fs';
import { join } from 'path';

export default class ErrorLogger {
    logsPath;
    _tracker;
    _logWriter;
    configuration;

    constructor(outputDir, filename, tracker, debugConfig) {
        this.logsPath = join(outputDir, filename);
        this._tracker = tracker;
        this.configuration = debugConfig;
    }

    logError = (text, exception) => {
        this._tracker.incrementErrorCount();
        if (!this._logWriter) {
            this._logWriter = createWriteStream(
                this.logsPath,
                { autoClose: true }
            );
        }
        this._logWriter.write(`${text} (See data row #${this._tracker.totalRows})`);
        this._logWriter.write('\n');
        if (this.configuration.showUglyStackTracesOnError) {
            this._logWriter.write(exception.stack);
            this._logWriter.write('\n');
        }
    }

    close = () => {
        if (this._logWriter) this._logWriter.close();
    }
}