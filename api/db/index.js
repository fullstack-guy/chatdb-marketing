const { BasisTheory } = require('@basis-theory/basis-theory-js');
const { Pool } = require('pg');

module.exports = async (req, res) => {
    const bt = await new BasisTheory().init(process.env.NEXT_PRIVATE_BASIS_THEORY_KEY);

    if (req.method !== 'POST') {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    // Extract the query and the connection string token from the request body
    const { query, connectionStringToken } = req.body;

    if (!query || !connectionStringToken) {
        res.status(400).json({ error: 'No query or connection string token provided' });
        return;
    }

    try {
        // Use the Basis Theory API to retrieve the real connection string
        const connectionStringObject = await bt.tokens.retrieve(connectionStringToken);
        const connectionString = connectionStringObject.data;

        // Initialize the Postgres connection with the retrieved connection string
        const pool = new Pool({
            connectionString,
        });

        // Run the query
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        // Return the error code and message in the response
        res.status(500).json({
            error: 'Failed to run query',
            errorCode: err.code,
            errorMessage: err.message
        });
    }
};
