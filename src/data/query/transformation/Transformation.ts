import {Column} from './Column';

export interface Transformation {
    outputFile: string;
    columns: Column[]
}
