import {Aggregate} from './aggregate';

export interface Aggregation {
    outputFile: string,
    aggregates: Aggregate[]
}
