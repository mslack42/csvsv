import { createReadStream, mkdirSync } from 'fs';
import csv from 'csv-parser';
import { resolve, relative } from 'path';
import Tracker from "./tracker.js";
import QueryWrapper from './query-wrapper.js';
import ErrorLogger from "./error-logger.js";
import { RunQueryOpts } from '../data/opts/run-query-opts.js';
import Transformer from './transformer.js';
import Aggregator from './aggregator.js';
import { Query } from '../data/query/Query.js';

export const runQuery = async (runQueryOpts: RunQueryOpts) => {
    mkdirSync(runQueryOpts.output, {recursive: true});
    const query = await loadQuery(runQueryOpts.query);
    const configuration = query.query.configuration;
    const tracker = new Tracker(runQueryOpts.output, runQueryOpts.logs);
    const errorLogger = new ErrorLogger(
        runQueryOpts.output,
        runQueryOpts.logs, 
        tracker, 
        configuration.debug);
    query.initialise(runQueryOpts, errorLogger);

    createReadStream(runQueryOpts.data)
        .pipe(csv(configuration.csvReading))
        .on('data', await applyQuery(query, tracker))
        .on('end', () => { 
            query.close();
            tracker.logSummary();
        });
}

const loadQuery = async (queryFilepath: string) => {
    const configuredQuery: Query = (await import(resolve(relative(process.cwd(), queryFilepath)))).query;
    return new QueryWrapper(configuredQuery);
}

const applyQuery = async (query: QueryWrapper, tracker: Tracker) => {
    return async (data: any) => {
        const shouldBeIncluded = query.shouldInclude(data);
        tracker.incrementCounts(shouldBeIncluded);
        if (shouldBeIncluded)
        {
            query.transformers.forEach((t: Transformer) => t.applyTransform(data));
            query.aggregators.forEach((a: Aggregator) => a.applyAggregation(data));
        }
    }
}
