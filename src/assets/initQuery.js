
const anyOf = (...dataFns) => {
    return (data) => dataFns.some(f => f(data));
}
const allOf = (...dataFns) => {
    return (data) => dataFns.every(f => f(data));
}
const not = (dataFn) => {
    return (data) => !dataFn(data);
}
const stringFromEpoch = n => (new Date(n)).toDateString();

const query = {
    inclusions: [
        // (datarow) => true
    ],
    exclusions: [
    ],
    transformations: [
        {
            outputFile: "output.csv",
            columns: [
                {
                    header: "Header",
                    cellFunction: datarow => datarow
                }
            ]
        }
    ],
    aggregations: [
        {
            outputFile: "aggs.txt",
            aggregates: [
                {
                    name: "Count",
                    initial: 0,
                    reducer: (acc, datarow) => acc + 1
                }
            ]
        }
    ],
    configuration: {
        csvWriting: {
            fieldDelimiter: ",",
            recordDelimiter: "\n",
            alwaysQuote: false
        },
        csvReading: {
            separator: ",",
            quote: "\"",
            newline: "\n",
            escape: "\""
        },
        debug: {
            showUglyStackTracesOnError: false
        }
    },
};

module.exports = { query };