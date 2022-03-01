import chalk from 'chalk';

export default class Tracker {
    private includedRows: number = 0;
    public totalRows: number = 0;
    private errorCount: number = 0;
    private outputDirectory: string;
    private errorLogName: string;

    constructor(outputDir: string, errorLogName: string) {
        this.outputDirectory = outputDir;
        this.errorLogName = errorLogName;
    }

    public incrementCounts = (included: boolean) => {
        this.totalRows++;
        if (included) this.includedRows++;
    };

    public incrementErrorCount = () => {
        this.errorCount++;
    }

    public logSummary = () => {
        let logFn = console.log;
        if (this.errorCount > 0) {
            logFn = (log: string) => console.log(chalk.red(log));
        }
        logFn(`Query Complete`);
        logFn(`Total rows: ${this.totalRows}`);
        logFn(`Included rows: ${this.includedRows}`);
        logFn(`Errors: ${this.errorCount}`);
        if (this.errorCount > 0) {
            logFn(`See ${this.errorLogName} in ${this.outputDirectory} for error details`);
            logFn(`Other outputs in ${this.outputDirectory} may not be accurate`);
        } else {
            logFn(`See ${this.outputDirectory} for output`)
        }
    }
}