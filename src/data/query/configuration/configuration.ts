import {CsvReading} from './csvReading';
import {CsvWriting} from './csvWriting';
import {Debug} from './debug';

export interface Configuration {
    csvWriting: CsvWriting,
    csvReading: CsvReading,
    debug: Debug
}
