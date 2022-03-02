import {Aggregation} from './aggregation/Aggregation';
import {Configuration} from './configuration/Configuration';
import {Transformation} from './transformation/Transformation';

export interface Query {
    inclusions: ((data:any) => boolean)[],
    exclusions: ((data:any) => boolean)[],
    transformations: Transformation[],
    aggregations: Aggregation[],
    configuration: Configuration
}
