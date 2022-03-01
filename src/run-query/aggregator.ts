import { createWriteStream } from 'fs';
import { join } from 'path';
import { Aggregate } from '../data/query/aggregation/Aggregate';
import { Aggregation } from '../data/query/aggregation/Aggregation';
import ErrorLogger from './error-logger';

export default class Aggregator {
    private aggregates: Aggregate[];
    private outputPath: string;
    private errorLogger: ErrorLogger;

    constructor(aggregation: Aggregation, outputDir: string, errorLogger: ErrorLogger) {
        this.aggregates = aggregation.aggregates;
        this.outputPath = join(
            outputDir, 
            aggregation.outputFile);
        this.errorLogger = errorLogger;
    }

    public applyAggregation = (data: any) => {
        this.aggregates.forEach((a: Aggregate) => {
            try {
                a.initial = a.reducer(a.initial, data);
            } catch (e) {
                this.errorLogger.logError(
                    `Exception in aggregation '${a.name}': ${e.message}`,
                    e
                );
            }
        })
    }

    public close = () => {
        const writeStream = createWriteStream(
            this.outputPath, 
            { autoClose: true }
        );
        this.aggregates.forEach((a: Aggregate) => {
            let val = a.initial;
            if (a.final) {
                val = a.final(val);
            }
            writeStream.write(`${a.name}: ${JSON.stringify(val)}`);
        });
        writeStream.close();
    }
}