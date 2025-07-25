// CHALDAL/server/controllers/getCartItemsController.js
const db = require('../config/db'); // Path is relative from controllers to config

const getCartItems = async (req, res) => {
    let connection;
    try {

        const { customerId } = req.body;

        if (!customerId) {
            return res.status(400).json({ message: 'Customer Id required.' });
        }


        connection = await db.getConnection(); // Get a connection from the pool
        console.log('Connection to Oracle DB established for fetching cartItems.');

        // SQL query to select product data from your PRODUCT table
        // Column names adjusted to match your new schema: PRODUCT_NAME, UNIT_PRICE, PRODUCT_IMAGE, CATEGORY_ID, BRAND_ID
        // For 'category' name (e.g., "Fruits & Vegetables"), you'd typically JOIN with the CATEGORY table.
        // For simplicity, we'll return CATEGORY_ID and BRAND_ID directly, as indicated by the schema.
        const sql = `SELECT
                        P.PRODUCT_ID,
                        P.PRODUCT_NAME,
                        P.UNIT_PRICE,
                        P.DESCRIPTION,
                        P.PRODUCT_IMAGE,
                        C.CATEGORY_NAME,
                        (SELECT B.BRAND_NAME FROM BRAND B WHERE B.BRAND_ID = P.BRAND_ID) BRAND_NAME,
                        (SELECT B.WEBSITE FROM BRAND B WHERE B.BRAND_ID = P.BRAND_ID) BRAND_URL,
                        I.QUANTITY
                    FROM
                        CART_ITEM I
                        JOIN PRODUCT P ON (I.PRODUCT_ID = P.PRODUCT_ID)
                        JOIN CATEGORY C ON (P.CATEGORY_ID = C.CATEGORY_ID)
                    WHERE
                        I.CART_ID = (SELECT CART_ID FROM CART WHERE CUSTOMER_ID = :customerId)`;
        const result = await connection.execute(sql, {customerId});

        // Map the result to a friendly JSON format
        // The mapping here needs to reflect the column order in your SELECT statement
        const cartItems = result.rows.map(row => ({
            id: row[0],          // PRODUCT_ID
            name: row[1],        // PRODUCT_NAME
            price: row[2],       // UNIT_PRICE
            description: row[3], // DESCRIPTION
            imageUrl: row[4],    // PRODUCT_IMAGE (mapped to imageUrl for frontend consistency)
            category: row[5],    // CATEGORY_ID (will be the ID, not the name, without a JOIN)
            brandName: row[6],   // BRAND_ID (will be the ID, not the name, without a JOIN)
            brandSite: row[7],   // BRAND WEBSITE
            quantity: row[8]
        }));

        res.json(cartItems); // Send the cartItems as a JSON response
    } catch (err) {
        console.error('Error fetching cartItems from Oracle DB:', err);
        res.status(500).json({ message: 'Error fetching cartItems hello', error: err.message });
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
    getCartItems
};
