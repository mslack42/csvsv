import { createObjectCsvStringifier } from 'csv-writer';
import { ObjectCsvStringifier } from 'csv-writer/src/lib/csv-stringifiers/object';
import { createWriteStream, WriteStream } from 'fs';
import { join } from 'path';
import { CsvWriting } from '../data/query/configuration/CsvWriting';
import { Column } from '../data/query/transformation/Column';
import { Transformation } from '../data/query/transformation/Transformation';
import ErrorLogger from './error-logger';

export default class Transformer {
    private csvStringifier: ObjectCsvStringifier;
    private writeStream: WriteStream;
    private transformation: Transformation;
    private errorLogger: ErrorLogger;

    constructor(transformation: Transformation, outputDir: string, writingConfig: CsvWriting, errorLogger: ErrorLogger) {
        this.transformation = transformation;
        this.csvStringifier = createObjectCsvStringifier({
            header: this.transformation.columns.map((c: Column) => {
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
                this.transformation.outputFile), 
            { autoClose: true });
        this.writeStream.write(this.csvStringifier.getHeaderString());
        this.errorLogger = errorLogger;
    }

    public close = () => {
        this.writeStream.close();
    }

    public applyTransform = (data: any) => {
        let output: any = {};
        for (let c of this.transformation.columns) {
            try {
                output[c.header] = c.cellFunction(data);
            } catch (e) {
                this.errorLogger.logError(
                    `Exception in transformation column '${c.header}': ${e.message}`, 
                    e
                )
            }
        };
        this.writeStream.write(this.csvStringifier.stringifyRecords([output]));
    }
}