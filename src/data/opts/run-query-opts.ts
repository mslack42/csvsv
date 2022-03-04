import {QueryOpts} from './query-opts';

export interface RunQueryOpts extends QueryOpts {
    data: string,
    output: string,
    query: string,
    logs: string
}
