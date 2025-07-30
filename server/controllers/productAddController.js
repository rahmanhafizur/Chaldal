// CHALDAL/server/controllers/productAddController.js
const db = require('../config/db'); // Path to your database configuration

const productAdd = async (req, res) => {
    let connection;
    try {
        // 1. Get user data from the request body
        const { name, description, price, image, category, brand } = req.body;

        // 2. Basic Server-side Validation
        if (!name || !price || !category || !brand) {
            return res.status(400).json({ message: 'All fields are required for signup.' });
        }

        // Optional: Add more robust validation (e.g., email format, phone format, password strength)
        // Check if username or email already exists to prevent duplicates
        connection = await db.getConnection();
        console.log('Connection to Oracle DB established for signup.');

        // Check for existing username or email
        const sql1 = `SELECT
                       BRAND_ID
                     FROM
                       BRAND
                     WHERE
                       BRAND_NAME = :brandName`;

        const result1 = await connection.execute(sql1, { brand });

        if (count.rows[0][0] === 0) {
            const sql2 = `INSERT INTO BRAND(BRAND_NAME) VALUES(:brand)`;
            const result2 = await connection.execute(sql2, { brand });

            if (result2.rowsAffected && result.rowsAffected === 0) {
                console.error('Failed to insert new brand. Rows affected:', result2.rowsAffected);
                res.status(500).json({ message: 'Failed to insert brand. No rows affected.' });
            }
        }

        // 3. Hash the password
        // Generate a salt and hash the password. A salt is random data that is used as an additional
        // input to a one-way function that hashes data, typically a password or passphrase.
        // This prevents identical passwords from having identical hashes (salt rounds recommended 10-12).
        // const saltRounds = 10;
        // console.log('Password hashed successfully.');

        // 4. SQL query to insert new customer data
        // Ensure your CUSTOMER table has columns for CUSTOMER_NAME, CUSTOMER_PHONE, CUSTOMER_EMAIL, USERNAME, CUSTOMER_PASSWORD
        const insertSql =   `INSERT INTO PRODUCT(PRODUCT_NAME, DESCRIPTION, UNIT_PRICE, PRODUCT_IMAGE, CATEGORY_ID, BRAND_ID)
                            VALUES(
                                :name,
                                :description,
                                :price,
                                :image,
                                (SELECT CATEGORY_ID FROM CATEGORY WHERE CATEGORY_NAME = :category),
                                (SELECT BRAND_ID FROM BRAND WHERE BRAND_NAME = :brand)
                            )`;

        // Execute the insert query
        const result3 = await connection.execute(insertSql, {
            name,
            description,
            price,
            image,
            category,
            brand
        }, { autoCommit: true }); // autoCommit: true will commit the transaction immediately

        // Check if the insertion was successful
        if (result3.rowsAffected && result.rowsAffected === 1) {
            console.log('New product added successfully.');
            res.status(201).json({ message: 'product added successfully!' }); // 201 Created
        } else {
            console.error('Failed to add product. Rows affected:', result.rowsAffected);
            res.status(500).json({ message: 'Failed to add product. No rows affected.' });
        }

    } catch (err) {
        // Handle any errors that occur during the process
        console.error('Error during add product:', err);
        
        res.status(500).json({ message: 'Error during add product', error: err.message });
    } finally {
        // Always close the database connection
        if (connection) {
            try {
                await connection.close();
                console.log('Connection to Oracle DB released after signup attempt.');
            } catch (err) {
                console.error('Error closing connection after signup:', err);
            }
        }
    }
};

module.exports = {
    productAdd
};
