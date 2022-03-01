import { RunQueryOpts } from '../data/opts/run-query-opts.js';
import { Aggregation } from '../data/query/aggregation/Aggregation.js';
import { Query } from '../data/query/Query.js';
import { Transformation } from '../data/query/transformation/Transformation.js';
import Aggregator from './aggregator.js';
import ErrorLogger from './error-logger.js';
import Transformer from './transformer.js';

export default class QueryWrapper {
    public transformers: Transformer[];
    public aggregators: Aggregator[];
    private errorLogger: ErrorLogger;
    public query: Query;

    constructor(importedQuery: Query) {
        this.query = importedQuery;
    }

    public shouldInclude = (data: any) => {
        return this.passesExclusions(data) && this.passesInclusions(data);
    }

    private passesInclusions = (data: any) => {
        for (let f of this.query.inclusions) {
            try {
                if (!f(data))
                {
                    return false;
                }
            } catch (e) {
                this.errorLogger.logError(
                    `Exception in inclusion check '${f}': ${e.message}`, 
                    e
                );
                return false;
            }
        };
        return true;
    };
    
    private passesExclusions = (data: any) => {
        for (let f of this.query.exclusions) {
            try {
                if (f(data))
                {
                    return false;
                }
            } catch (e) {
                this.errorLogger.logError(
                    `Exception in exclusion check '${f}': ${e.message}`, 
                    e
                );
                return false;
            }
        };
        return true;
    };

    public initialise = (runQueryOpts: RunQueryOpts, errorLogger: ErrorLogger) => {
        this.transformers = this.query.transformations
            .map((t: Transformation) => new Transformer(
                t, 
                runQueryOpts.output, 
                this.query.configuration.csvWriting,
                errorLogger));
        this.aggregators = this.query.aggregations
            .map((a: Aggregation) => new Aggregator(
                a, 
                runQueryOpts.output,
                errorLogger));
        this.errorLogger = errorLogger;
    }

    public close = () => {
        this.transformers.forEach(t => t.close());
        this.aggregators.forEach(a => a.close());
    }
}