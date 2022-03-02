# csvsv
Command-line tool that enables querying of CSV data using vanilla JS

# Outline of usage
Scenario: You have a large CSV file, and you want to do a somewhat-complex query against it - a grep won't cut it.

Run `csvsv init --with-docs`. A query.js file will be created, filled with advice on how to populate it to suit your needs.

Run `csvsv run`. A new directory will be created with outputs to match your query.js file.

For a full breakdown of supported functionality, run `csvsv -h`