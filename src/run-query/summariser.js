import chalk from 'chalk';

export default class Summariser {
    includedRows = 0;
    totalRows = 0;
    errorCount = 0;
    outputDirectory;
    errorLogName;

    constructor(outputDir, errorLogName) {
        this.outputDirectory = outputDir;
        this.errorLogName = errorLogName;
    }

    incrementCounts = included => {
        this.totalRows++;
        if (included) this.includedRows++;
    };

    incrementErrorCount = () => {
        this.errorCount++;
    }

    logSummary = () => {
        let logFn = console.log;
        if (this.errorCount > 0) {
            logFn = (log) => console.log(chalk.red(log));
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