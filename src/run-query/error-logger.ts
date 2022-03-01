import { createWriteStream, WriteStream } from 'fs';
import { join } from 'path';
import { Debug } from '../data/query/configuration/Debug';
import Tracker from './tracker';

export default class ErrorLogger {
    private logsPath: string;
    private tracker: Tracker;
    private logWriter: WriteStream;
    private configuration: Debug;

    constructor(outputDir: string, filename: string, tracker: Tracker, debugConfig: Debug) {
        this.logsPath = join(outputDir, filename);
        this.tracker = tracker;
        this.configuration = debugConfig;
    }

    public logError = (text: string, exception: Error) => {
        this.tracker.incrementErrorCount();
        if (!this.logWriter) {
            this.logWriter = createWriteStream(
                this.logsPath,
                { autoClose: true }
            );
        }
        this.logWriter.write(`${text} (See data row #${this.tracker.totalRows})`);
        this.logWriter.write('\n');
        if (this.configuration.showUglyStackTracesOnError) {
            this.logWriter.write(exception.stack);
            this.logWriter.write('\n');
        }
    }

    public close = () => {
        if (this.logWriter) this.logWriter.close();
    }
}