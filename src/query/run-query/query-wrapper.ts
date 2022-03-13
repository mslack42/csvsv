import CliOptions from '../../cli-options.js';
import {Aggregation} from '../../data/query/aggregation/aggregation.js';
import {Query} from '../../data/query/query.js';
import {Transformation} from '../../data/query/transformation/transformation.js';
import Aggregator from './aggregator.js';
import ProcessErrorLogger from './process-error-logger.js';
import Transformer from './transformer.js';
import {resolve, relative} from 'path';
import {RunQueryOpts} from '../../data/opts/run-query-opts.js';
import {Configuration} from '../../data/query/configuration/configuration.js';
import {KnownError} from '../../errror/known-error.js';
import {existsSync, fstat} from 'fs';

export default class QueryWrapper {
  private static instance: QueryWrapper;

  public configuration: Configuration;
  private transformers: Transformer[];
  private aggregators: Aggregator[];
  private inclusions: ((data:any) => boolean)[];
  private exclusions: ((data:any) => boolean)[];

  private constructor(query: Query) {
    this.initialise(query);
  }

  private initialise = (query: Query) => {
    try {
      const opts: RunQueryOpts = CliOptions.getInstance().options;
      const queryOutput = opts.output;

      this.transformers = query.transformations
          .map((t: Transformation) => new Transformer(
              t,
              queryOutput,
              query.configuration.csvWriting));
      this.aggregators = query.aggregations
          .map((a: Aggregation) => new Aggregator(
              a,
              queryOutput));

      this.inclusions = query.inclusions;
      this.exclusions = query.exclusions;
      this.configuration = query.configuration;
    } catch (err) {
      throw new KnownError('Failed to parse the query - is it correctly formatted?');
    }
  };

  public static async getInstance() {
    if (!QueryWrapper.instance) {
      const cli = CliOptions.getInstance();
      const configuredQuery = await this.loadQuery(cli.options.query);
      QueryWrapper.instance = new QueryWrapper(configuredQuery);
    }
    return QueryWrapper.instance;
  }

  private static loadQuery = async (queryFilepath: string) => {
    let loadedQueryModule;
    const modulePath: string = resolve(relative(process.cwd(), queryFilepath));
    if (!existsSync(queryFilepath)) {
      throw new KnownError(`Query ${queryFilepath} doesn't exist`);
    }
    try {
      loadedQueryModule = await import(modulePath);
    } catch (err) {
      console.log(err);
      throw new KnownError(`Failed to load query data from ${queryFilepath}`);
    }
    try {
      const configuredQuery: Query = loadedQueryModule.query;
      return configuredQuery;
    } catch (err) {
      throw new KnownError('The specified query is incorrectly formatted');
    }
  };

  public shouldInclude = (data: any) => {
    return this.passesExclusions(data) && this.passesInclusions(data);
  };

  private passesInclusions = (data: any) => {
    for (const f of this.inclusions) {
      try {
        if (!f(data)) {
          return false;
        }
      } catch (e) {
        ProcessErrorLogger.getInstance().logError(
            `Exception in inclusion check '${f}': ${e.message}`,
            e,
        );
        return false;
      }
    };
    return true;
  };

  private passesExclusions = (data: any) => {
    for (const f of this.exclusions) {
      try {
        if (f(data)) {
          return false;
        }
      } catch (e) {
        ProcessErrorLogger.getInstance().logError(
            `Exception in exclusion check '${f}': ${e.message}`,
            e,
        );
        return false;
      }
    };
    return true;
  };

  public applyQueryToData = (data: any) => {
    this.transformers.forEach((t: Transformer) => t.applyTransform(data));
    this.aggregators.forEach((a: Aggregator) => a.applyAggregation(data));
  };

  public close = () => {
    this.transformers.forEach((t) => t.close());
    this.aggregators.forEach((a) => a.close());
  };
}
