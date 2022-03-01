import { createWriteStream } from 'fs';
import { join } from 'path';

export default class Aggregator {
    aggregates;
    outputPath;
    _errorLogger;

    constructor(configuredAggregates, outputDir, errorLogger) {
        this.aggregates = configuredAggregates.aggregates;
        this.outputPath = join(
            outputDir, 
            configuredAggregates.outputFile);
        this._errorLogger = errorLogger;
    }

    applyAggregation = (data) => {
        this.aggregates.forEach(a => {
            try {
                a.initial = a.reducer(a.initial, data);
            } catch (e) {
                this._errorLogger.logError(
                    `Exception in aggregation '${a.name}': ${e.message}`,
                    e
                );
            }
        })
    }

    close = () => {
        const writeStream = createWriteStream(
            this.outputPath, 
            { autoClose: true }
        );
        this.aggregates.forEach(a => {
            let val = a.initial;
            if (a.final) {
                val = a.final(val);
            }
            writeStream.write(`${a.name}: ${JSON.stringify(val)}`);
        });
        writeStream.close();
    }
}