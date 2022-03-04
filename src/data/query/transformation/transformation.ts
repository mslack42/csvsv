import {Column} from './column';

export interface Transformation {
    outputFile: string;
    columns: Column[]
}
