import { createWriteStream } from 'fs';
import { join } from 'path';

export default class ErrorLogger {
    logsPath;
    _summariser;
    _logWriter;
    configuration;

    constructor(outputDir, filename, summariser, debugConfig) {
        this.logsPath = join(outputDir, filename);
        this._summariser = summariser;
        this.configuration = debugConfig;
    }

    logError = (text, exception) => {
        this._summariser.incrementErrorCount();
        if (!this._logWriter) {
            this._logWriter = createWriteStream(
                this.logsPath,
                { autoClose: true }
            );
        }
        this._logWriter.write(text);
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