import {CsvReading} from './CsvReading';
import {CsvWriting} from './CsvWriting';
import {Debug} from './Debug';

export interface Configuration {
    csvWriting: CsvWriting,
    csvReading: CsvReading,
    debug: Debug
}
