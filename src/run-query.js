import { createReadStream, mkdirSync } from 'fs';
import csv from 'csv-parser';
import { resolve, relative } from 'path';
import Summariser from "./run-query/summariser.js";
import Query from './run-query/query-object.js';
import ErrorLogger from "./run-query/error-logger.js";

export const runQuery = async runQueryOpts => {
    mkdirSync(runQueryOpts.output, {recursive: true});
    const query = await loadQuery(runQueryOpts.query);
    const summariser = new Summariser(runQueryOpts.output, runQueryOpts.logs);
    const errorLogger = new ErrorLogger(
        runQueryOpts.output,
        runQueryOpts.logs, 
        summariser, 
        query.configuration.debug);
    query.initialise(runQueryOpts, errorLogger);

    createReadStream(runQueryOpts.data)
        .pipe(csv(query.configuration.csvReading))
        .on('data', await applyQuery(query, summariser))
        .on('end', () => { 
            query.close();
            summariser.logSummary();
        });
}

const loadQuery = async queryFilepath => {
    const configuredQuery = (await import(resolve(relative(process.cwd(), queryFilepath)))).query;
    return new Query(configuredQuery);
}

const applyQuery = async (query, summariser) => {
    return async data => {
        const shouldBeIncluded = query.shouldInclude(data);
        if (shouldBeIncluded)
        {
            query.transformations.forEach(t => t.applyTransform(data));
            query.aggregations.forEach(a => a.applyAggregation(data));
        }
        summariser.incrementCounts(shouldBeIncluded);
    }
}
