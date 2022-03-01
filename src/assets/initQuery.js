
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

export const query = {
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
                    name: "Id Count",
                    initial: new Set(),
                    reducer: (acc, datarow) => acc.add(datarow["UniqueIdentifier"]),
                    final: (acc) => acc.size
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