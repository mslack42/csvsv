// This file should export a 'query' const of a certain format
// This will define the behaviour of the csv-sieve
//  - Which rows is cares about
//  - What data to extract from those rows
//  - How to present that data once it's done

// ***********
// Definitions
// ***********
// You can define any additional JS constants you like here:
//  e.g. const square = x => x*x;

// ****************
// Useful functions
// ****************
// As common use-cases, these functions are provided by default
// (though feel free to delete them if you don't want them)
const anyOf = (...dataFns) => {
  return (data) => dataFns.some((f) => f(data));
};
const allOf = (...dataFns) => {
  return (data) => dataFns.every((f) => f(data));
};
const not = (dataFn) => {
  return (data) => !dataFn(data);
};
const stringFromEpoch = (n) => (new Date(n)).toDateString();

// *****
// Query
// *****
// This is the object that finally defines what the tool should do
// Annotations are provided inline
export const query = {
  inclusions: [
    // This should be a list of functions of the form
    //   f: (datarow) => boolean
    // If f(datarow), then the datarow will be passed to the transformations and aggregations below
    // datarow correspnds to a row of the data csv - columns can be access by header name (datarow.Header1)
  ],
  exclusions: [
    // This is similar to inclusions, except with the opposite effect
    // Any exclusion could be implemented as a negated inclusion - this configuration item is just included for convenience
  ],
  transformations: [
    // Transformations describe how a CSV should be processed into a new CSV
    // They take a format like the following:
    // {
    //     outputFile: "output.csv",
    //     columns: [
    //         {
    //             header: "Square",
    //             cellFunction: datarow => square(datarow.NumberField)
    //         }
    //     ]
    // }
    // Note that cellFunctions should be of the form:
    //  f: (datarow) => any
    // Their output will end up as stringified CSV column data.
  ],
  aggregations: [
    // Aggregations allow you to combine row data in various ways
    // Example:
    // {
    // outputFile: "aggs.txt",
    // aggregates: [
    //     {
    //         name: "Id Count",
    //         initial: new Set(),
    //         reducer: (acc, datarow) => acc.add(datarow["UniqueIdentifier"]),
    //         final: (acc) => acc.size
    //     }
    // ]
    // }
    // The tool will apply the reducer to the initial value and each datarow in turn.
    // The final result will be included in the outputs directory.
    // An optional 'final' method can be applied to do any post-processing needed after aggregation
  ],
  // Various apsects of the tool are configurable:
  configuration: {
    csvWriting: { // i.e. what do you want your CSV to look like
      fieldDelimiter: ',', // ";" also supported
      recordDelimiter: '\n', // "\n\r" also supported
      alwaysQuote: false,
    },
    csvReading: { // Configuration items describing the CSV being ingested
      separator: ',',
      quote: '"',
      newline: '\n',
      escape: '"',
    },
    debug: { // If you have no idea why your query isn't working, maybe some stack traces will help
      showUglyStackTracesOnError: false,
    },
  },
};
