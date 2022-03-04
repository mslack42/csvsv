import {createObjectCsvStringifier} from 'csv-writer';
import {ObjectCsvStringifier} from 'csv-writer/src/lib/csv-stringifiers/object';
import {createWriteStream, WriteStream} from 'fs';
import {join} from 'path';
import {CsvWriting} from '../data/query/configuration/csvWriting.js';
import {Column} from '../data/query/transformation/column.js';
import {Transformation} from '../data/query/transformation/transformation.js';
import {KnownError} from '../errror/known-error.js';
import ProcessErrorLogger from './process-error-logger.js';

export default class Transformer {
  private csvStringifier: ObjectCsvStringifier;
  private writeStream: WriteStream;
  private transformation: Transformation;

  constructor(transformation: Transformation, outputDir: string, writingConfig: CsvWriting) {
    this.transformation = transformation;
    this.csvStringifier = createObjectCsvStringifier({
      header: this.transformation.columns.map((c: Column) => {
        return {
          id: c.header,
          title: c.header,
        };
      }),
      ...writingConfig,
    });
    const filepath = join(
        outputDir,
        this.transformation.outputFile);
    this.writeStream = createWriteStream(
        filepath,
        {autoClose: true})
        .on('error', () => {
          throw new KnownError(`Failed to write output to ${filepath}`);
        });
    this.writeStream.write(this.csvStringifier.getHeaderString());
  }

  public close = () => {
    this.writeStream.close();
  };

  public applyTransform = (data: any) => {
    const output: any = {};
    for (const c of this.transformation.columns) {
      try {
        output[c.header] = c.cellFunction(data);
      } catch (e) {
        ProcessErrorLogger.getInstance().logError(
            `Exception in transformation column '${c.header}': ${e.message}`,
            e,
        );
      }
    };
    this.writeStream.write(this.csvStringifier.stringifyRecords([output]));
  };
}
