import { createObjectCsvStringifier } from 'csv-writer/dist/index.js';
import { createWriteStream } from 'fs';
import { join } from 'path';

export default class Transformer {
    csvStringifier;
    writeStream;
    transform;
    _errorLogger;

    constructor(configuredTransform, outputDir, writingConfig, errorLogger) {
        this.transform = configuredTransform;
        this.csvStringifier = createObjectCsvStringifier({
            header: this.transform.columns.map(c => {
                return {
                    id: c.header,
                    title: c.header
                }
            }),
            ...writingConfig
        });
        this.writeStream = createWriteStream(
            join(
                outputDir, 
                this.transform.outputFile), 
            { autoClose: true });
        this.writeStream.write(this.csvStringifier.getHeaderString());
        this._errorLogger = errorLogger;
    }

    close = () => {
        this.writeStream.close();
    }

    applyTransform = (data) => {
        let output = {};
        for (let c of this.transform.columns) {
            try {
                output[c.header] = c.cellFunction(data);
            } catch (e) {
                this._errorLogger.logError(
                    `Exception in transformation column '${c.header}': ${e.message}`, 
                    e
                )
            }
        };
        this.writeStream.write(this.csvStringifier.stringifyRecords([output]));
    }
}