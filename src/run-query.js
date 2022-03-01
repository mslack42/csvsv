import { createReadStream, mkdirSync } from 'fs';
import csv from 'csv-parser';
import { resolve, relative } from 'path';
import Tracker from "./run-query/tracker.js";
import Query from './run-query/query-object.js';
import ErrorLogger from "./run-query/error-logger.js";

export const runQuery = async runQueryOpts => {
    mkdirSync(runQueryOpts.output, {recursive: true});
    const query = await loadQuery(runQueryOpts.query);
    const tracker = new Tracker(runQueryOpts.output, runQueryOpts.logs);
    const errorLogger = new ErrorLogger(
        runQueryOpts.output,
        runQueryOpts.logs, 
        tracker, 
        query.configuration.debug);
    query.initialise(runQueryOpts, errorLogger);

    createReadStream(runQueryOpts.data)
        .pipe(csv(query.configuration.csvReading))
        .on('data', await applyQuery(query, tracker))
        .on('end', () => { 
            query.close();
            tracker.logSummary();
        });
}

const loadQuery = async queryFilepath => {
    const configuredQuery = (await import(resolve(relative(process.cwd(), queryFilepath)))).query;
    return new Query(configuredQuery);
}

const applyQuery = async (query, tracker) => {
    return async data => {
        const shouldBeIncluded = query.shouldInclude(data);
        tracker.incrementCounts(shouldBeIncluded);
        if (shouldBeIncluded)
        {
            query.transformations.forEach(t => t.applyTransform(data));
            query.aggregations.forEach(a => a.applyAggregation(data));
        }
    }
}
