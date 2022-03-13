import {createWriteStream} from 'fs';
import {join} from 'path';
import {Aggregate} from '../../data/query/aggregation/aggregate.js';
import {Aggregation} from '../../data/query/aggregation/aggregation.js';
import {KnownError} from '../../errror/known-error.js';
import ProcessErrorLogger from './process-error-logger.js';

export default class Aggregator {
  private aggregates: Aggregate[];
  private outputPath: string;

  constructor(aggregation: Aggregation, outputDir: string) {
    this.aggregates = aggregation.aggregates;
    this.outputPath = join(
        outputDir,
        aggregation.outputFile);
  }

  public applyAggregation = (data: any) => {
    this.aggregates.forEach((a: Aggregate) => {
      try {
        a.initial = a.reducer(a.initial, data);
      } catch (e) {
        ProcessErrorLogger.getInstance().logError(
            `Exception in aggregation '${a.name}': ${e.message}`,
            e,
        );
      }
    });
  };

  public close = () => {
    const writeStream = createWriteStream(
        this.outputPath,
        {autoClose: true},
    ).on('error', () => {
      throw new KnownError(`Failed to write outputs to ${this.outputPath}`);
    });
    this.aggregates.forEach((a: Aggregate) => {
      let val = a.initial;
      if (a.final) {
        val = a.final(val);
      }
      writeStream.write(`${a.name}: ${JSON.stringify(val)}`);
    });
    writeStream.close();
  };
}
