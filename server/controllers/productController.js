// CHALDAL/server/controllers/productController.js
const db = require('../config/db'); // Path is relative from controllers to config

const getProducts = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection(); // Get a connection from the pool
        console.log('Connection to Oracle DB established for fetching products.');

        // SQL query to select product data from your PRODUCT table
        // Column names adjusted to match your new schema: PRODUCT_NAME, UNIT_PRICE, PRODUCT_IMAGE, CATEGORY_ID, BRAND_ID
        // For 'category' name (e.g., "Fruits & Vegetables"), you'd typically JOIN with the CATEGORY table.
        // For simplicity, we'll return CATEGORY_ID and BRAND_ID directly, as indicated by the schema.
        const sql = `SELECT PRODUCT_ID, PRODUCT_NAME, UNIT_PRICE, DESCRIPTION, PRODUCT_IMAGE, CATEGORY_ID, BRAND_ID FROM PRODUCT ORDER BY PRODUCT_ID`;
        const result = await connection.execute(sql);

        // Map the result to a friendly JSON format
        // The mapping here needs to reflect the column order in your SELECT statement
        const products = result.rows.map(row => ({
            id: row[0],          // PRODUCT_ID
            name: row[1],        // PRODUCT_NAME
            price: row[2],       // UNIT_PRICE
            description: row[3], // DESCRIPTION
            imageUrl: row[4],    // PRODUCT_IMAGE (mapped to imageUrl for frontend consistency)
            category: row[5],    // CATEGORY_ID (will be the ID, not the name, without a JOIN)
            brandId: row[6]      // BRAND_ID (will be the ID, not the name, without a JOIN)
        }));

        res.json(products); // Send the products as a JSON response
    } catch (err) {
        console.error('Error fetching products from Oracle DB:', err);
        res.status(500).json({ message: 'Error fetching products', error: err.message });
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
    getProducts
};
