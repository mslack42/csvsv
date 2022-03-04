import {Aggregation} from './aggregation/aggregation';
import {Configuration} from './configuration/configuration';
import {Transformation} from './transformation/transformation';

export interface Query {
    inclusions: ((data:any) => boolean)[],
    exclusions: ((data:any) => boolean)[],
    transformations: Transformation[],
    aggregations: Aggregation[],
    configuration: Configuration
}
