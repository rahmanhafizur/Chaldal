// CHALDAL/server/controllers/signupController.js
const db = require('../config/db'); // Path to your database configuration
const bcrypt = require('bcryptjs'); // For password hashing

const signUp = async (req, res) => {
    let connection;
    try {
        // 1. Get user data from the request body
        const { name, phone, email, username, password } = req.body;

        // 2. Basic Server-side Validation
        if (!name || !phone || !email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required for signup.' });
        }

        // Optional: Add more robust validation (e.g., email format, phone format, password strength)
        // Check if username or email already exists to prevent duplicates
        connection = await db.getConnection();
        console.log('Connection to Oracle DB established for signup.');

        // Check for existing username or email
        const sql = `SELECT
                        COUNT(*)
                    FROM
                        CUSTOMER
                    WHERE
                        CUSTOMER_EMAIL = :email
                    OR USERNAME = :username`;

        const count = await connection.execute(sql, { email, username });

        if (count.rows[0][0] > 0) {
            return res.status(409).json({ message: 'Username or Email already exists.' });
        }

        // 3. Hash the password
        // Generate a salt and hash the password. A salt is random data that is used as an additional
        // input to a one-way function that hashes data, typically a password or passphrase.
        // This prevents identical passwords from having identical hashes (salt rounds recommended 10-12).
        // const saltRounds = 10;
        // console.log('Password hashed successfully.');

        // 4. SQL query to insert new customer data
        // Ensure your CUSTOMER table has columns for CUSTOMER_NAME, CUSTOMER_PHONE, CUSTOMER_EMAIL, USERNAME, CUSTOMER_PASSWORD
        const insertSql =   `INSERT INTO CUSTOMER (CUSTOMER_NAME, CUSTOMER_PHONE, CUSTOMER_EMAIL, USERNAME, CUSTOMER_PASSWORD)
                            VALUES (:name, :phone, :email, :username, :password)`;

        // Execute the insert query
        const result = await connection.execute(insertSql, {
            name,
            phone,
            email,
            username,
            password
        }, { autoCommit: true }); // autoCommit: true will commit the transaction immediately

        // Check if the insertion was successful
        if (result.rowsAffected && result.rowsAffected === 1) {
            console.log('New customer registered successfully.');
            res.status(201).json({ message: 'User registered successfully!' }); // 201 Created
        } else {
            console.error('Failed to insert new customer. Rows affected:', result.rowsAffected);
            res.status(500).json({ message: 'Failed to register user. No rows affected.' });
        }

    } catch (err) {
        // Handle any errors that occur during the process
        console.error('Error during signup:', err);
        // Check for specific Oracle errors if needed, e.g., unique constraint violation
        if (err.message.includes('ORA-00001')) { // Example: Unique constraint violated
            res.status(409).json({ message: 'Username or Email already exists.' });
        } else {
            res.status(500).json({ message: 'Error during signup', error: err.message });
        }
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
    signUp
};
