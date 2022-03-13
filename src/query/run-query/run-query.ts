import {createReadStream, mkdirSync} from 'fs';
import csv from 'csv-parser';
import Tracker from './tracker.js';
import QueryWrapper from './query-wrapper.js';
import {RunQueryOpts} from '../../data/opts/run-query-opts.js';
import CliOptions from '../../cli-options.js';
import {KnownError} from '../../errror/known-error.js';

export const runQuery = async (runQueryOpts: RunQueryOpts) => {
  CliOptions.getInstance().loadOptions(runQueryOpts);

  prepareOutputDirectory();

  const query = await QueryWrapper.getInstance();
  const readingConf = query.configuration.csvReading;

  createReadStream(runQueryOpts.data)
      .pipe(csv(readingConf))
      .on('data', applyQuery(query))
      .on('end', () => {
        query.close();
        Tracker.getInstance().logSummary();
      })
      .on('error', () => {
        throw new KnownError(`Failed to read data from ${runQueryOpts.data}`);
      });
};

const prepareOutputDirectory = () => {
  const opts: RunQueryOpts = CliOptions.getInstance().options;
  try {
    mkdirSync(opts.output, {recursive: true});
  } catch (err) {
    throw new KnownError(`Unable to create output directory at ${opts.output}`);
  }
};

const applyQuery = (query: QueryWrapper) => {
  return (data: any) => {
    const shouldBeIncluded = query.shouldInclude(data);
    Tracker.getInstance().incrementCounts(shouldBeIncluded);
    if (shouldBeIncluded) {
      query.applyQueryToData(data);
    }
  };
};
