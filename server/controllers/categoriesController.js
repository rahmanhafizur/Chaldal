// CHALDAL/server/controllers/categoriesController.js
const db = require('../config/db'); // Path is relative from controllers to config

const getCategories = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection(); // Get a connection from the pool
        console.log('Connection to Oracle DB established for fetching products.');

        // SQL query to select product data from your PRODUCT table
        // Column names adjusted to match your new schema: PRODUCT_NAME, UNIT_PRICE, PRODUCT_IMAGE, CATEGORY_ID, BRAND_ID
        // For 'category' name (e.g., "Fruits & Vegetables"), you'd typically JOIN with the CATEGORY table.
        // For simplicity, we'll return CATEGORY_ID and BRAND_ID directly, as indicated by the schema.
        const sql = `SELECT
                        CATEGORY_NAME
                    FROM
                        CATEGORY`;
        const result = await connection.execute(sql);

        // Map the result to a friendly JSON format
        // The mapping here needs to reflect the column order in your SELECT statement
        const categories = result.rows.map(row => ({
            categoryName: row[0]
        }));

        res.json(categories); // Send the products as a JSON response
    } catch (err) {
        console.error('Error fetching categories from Oracle DB:', err);
        res.status(500).json({ message: 'Error fetching categories', error: err.message });
    } finally {
        if (connection) {
            try {
                await connection.close(); // Release the connection back to the pool
                console.log('Connection to Oracle DB released.');
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

module.exports = {
    getCategories
};
