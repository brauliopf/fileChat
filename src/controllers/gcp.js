// Must be connected to Google Cloud Platform
// Authenticate to BigQuery: https://cloud.google.com/bigquery/docs/authentication#client-libs
import { BigQuery } from '@google-cloud/bigquery';

// @desc    Test connection to GCP Public Dataset
// @route   GET /bigquery/test
// @access  Public
export const test = async (req, res, next) => {

    // The SQL query to run
    const sqlQuery = `
    SELECT *
    FROM \`bigquery-public-data.stackoverflow.posts_questions\`
    WHERE tags like '%google-bigquery%'
    ORDER BY view_count DESC
    LIMIT 10`;

    async function queryPublicDataset(query) {
    // Queries a public Stack Overflow dataset.

        const bigqueryClient = new BigQuery();

        // Run the query
        const [rows] = await bigqueryClient.query({
            query,
            location: 'US', // Location must match that of the dataset(s) referenced in the query.
            }
        );

        return rows;
    }

    const output = await queryPublicDataset(sqlQuery);

    if (output) { res.status(200).json({ output }); }
    else { res.status(404).json({ error: "Could not perform query" }) }
}