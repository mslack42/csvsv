import {QueryOpts} from './query-opts';

export interface InitQueryOpts extends QueryOpts {
    withDocs: boolean,
    name: string
}
