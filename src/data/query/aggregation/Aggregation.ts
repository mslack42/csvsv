import {Aggregate} from './Aggregate';

export interface Aggregation {
    outputFile: string,
    aggregates: Aggregate[]
}
