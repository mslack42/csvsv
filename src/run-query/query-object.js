import Aggregator from './aggregator.js';
import Transformer from './transformer.js';

export default class Query {
    inclusions;
    exclusions;
    _transformations;
    transformations;
    _aggregations;
    aggregations;
    configuration;
    _errorLogger;

    constructor(importedQuery) {
        this.inclusions = importedQuery.inclusions;
        this.exclusions = importedQuery.exclusions;
        this._transformations = importedQuery.transformations;
        this._aggregations = importedQuery.aggregations;
        this.configuration = importedQuery.configuration;
    }

    shouldInclude = (data) => {
        return this.passesExclusions(data) && this.passesInclusions(data);
    }

    passesInclusions = (data) => {
        for (let f of this.inclusions) {
            try {
                if (!f(data))
                {
                    return false;
                }
            } catch (e) {
                this._errorLogger.logError(
                    `Exception in inclusion check '${f}': ${e.message}`, 
                    e
                );
                return false;
            }
        };
        return true;
    };
    
    passesExclusions = (data) => {
        for (let f of this.exclusions) {
            try {
                if (f(data))
                {
                    return false;
                }
            } catch (e) {
                this._errorLogger.logError(
                    `Exception in exclusion check '${f}': ${e.message}`, 
                    e
                );
                return false;
            }
        };
        return true;
    };

    initialise = (runQueryOpts, errorLogger) => {
        this.transformations = this._transformations
            .map(t => new Transformer(
                t, 
                runQueryOpts.output, 
                this.configuration.csvWriting,
                errorLogger));
        this.aggregations = this._aggregations
            .map(a => new Aggregator(
                a, 
                runQueryOpts.output,
                errorLogger));
        this._errorLogger = errorLogger;
    }

    close = () => {
        this.transformations.forEach(t => t.close());
        this.aggregations.forEach(a => a.close());
    }
}