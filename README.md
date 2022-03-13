# csvsv
Command-line tool that enables querying of CSV data using vanilla JS

# Outline of usage
Scenario: You have a large CSV file, and you want to do a somewhat-complex query against it - a grep won't cut it.

Run `csvsv init --with-docs`. A query.mjs file will be created, filled with advice on how to populate it to suit your needs.

Run `csvsv run`. A new directory will be created with outputs to match your query.mjs file.

For a full breakdown of supported functionality, run `csvsv -h`

# Features
 - Apply filters to the CSV - include/exclude just the rows you care about
 - Extract & transform the data - create new CSV rows from old, using plain old Javascript
 - Aggregate - import simple functions to aggregate over rows. For instance, use this to find counts, totals, or generate lists of unique identifiers