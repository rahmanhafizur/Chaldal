// CHALDAL/server/controllers/authController.js
const db = require('../config/db'); // Path is relative from controllers to config
const bcrypt = require('bcryptjs'); // You'll need to install this library for password hashing

const signIn = async (req, res) => {

    let connection;
    try {
        // 1. Get username and password from the request body
        // The client (App.js) will send these in the JSON body of the POST request.
        // We assume 'username' from the client can be either CUSTOMER_EMAIL or CUSTOMER_NAME.
        const { username, password } = req.body;

        // Basic validation: Check if username and password are provided
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // 2. Get a database connection from the pool
        connection = await db.getConnection();
        console.log('Connection to Oracle DB established for sign-in.');

        // 3. SQL query to find the user by their email OR name
        // IMPORTANT: 'CUSTOMER_PASSWORD' should store the HASHED password.
        // We use a single bind variable ':identifier' to match against both email and name.
        const sql = `SELECT
                        CUSTOMER_ID,
                        USERNAME,
                        CUSTOMER_NAME,
                        CUSTOMER_PHONE,
                        CUSTOMER_EMAIL,
                        CUSTOMER_PASSWORD
                    FROM
                        CUSTOMER
                    WHERE
                        USERNAME = :identifier
                        OR CUSTOMER_EMAIL = :identifier`; // Assuming USERNAME refers to CUSTOMER_NAME

        // Execute the query, binding the 'username' from the client to the ':identifier' parameter.
        // This allows the user to log in with either their email or their customer name.
        const result = await connection.execute(sql, { identifier: username });

        // 4. Check if a user was found
        if (result.rows.length === 0) {
            // User not found, return an error. Use a generic message ("Invalid username or password")
            // for security reasons to avoid revealing whether the username or password was incorrect.
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Extract user data from the first (and only) row found
        // result.rows[0] is an array containing the column values in the order they were selected.
        const customerData = result.rows[0]; // This is the array for the first row
        const user = {
            id: customerData[0],                // CUSTOMER_ID
            username: customerData[1],          // USERNAME
            name: customerData[2],              // CUSTOMER_NAME
            phone: customerData[3],             // CUSTOMER_PHONE
            email: customerData[4],             // CUSTOMER_EMAIL
            hashPassword: customerData[5],      // CUSTOMER_PASSWORD (this should be the hashed password from DB)
            status: 'customer'
        };

        // 5. Compare the provided plain-text password with the hashed password from the database
        // bcrypt.compare() handles the salting and hashing internally for comparison.
        const isMatch = (password == user.hashPassword);

        if (!isMatch) {
            // Passwords do not match, return an error. Again, use a generic message.
            return res.status(401).json({ message: 'Invalid username or password.' });
        }


        const sql2 = `SELECT
                      *
                    FROM
                      ADMIN
                    WHERE
                      CUSTOMER_ID = :identifier`;

        const result2 = await connection.execute(sql2, { identifier: customerData[0] });

        if (result2.rows.length !== 0) {
            user.status = 'admin';
        }


        // 6. If username and password are valid (match found and hash confirmed)
        // Send a success response back to the client.
        // In a real-world application, you would typically generate a JSON Web Token (JWT) here
        // and send it back to the client. The client would then store this token
        // and include it in subsequent requests to access protected resources.
        res.status(200).json({
            message: 'Sign-in successful!',
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                phone: user.phone,
                status: user.status
            },
            // Example of where a JWT would be sent:
            // token: 'YOUR_GENERATED_JWT_HERE'
        });

    } catch (err) {
        // Handle any errors that occur during the process (e.g., database connection issues, SQL errors)
        console.error('Error during sign-in:', err);
        res.status(500).json({ message: 'Error during sign-in', error: err.message });
    } finally {
        // Always close the database connection to release it back to the pool
        if (connection) {
            try {
                await connection.close();
                console.log('Connection to Oracle DB released after sign-in attempt.');
            } catch (err) {
                console.error('Error closing connection after sign-in:', err);
            }
        }
    }
};

// Export the signIn function so it can be used by your Express routes (e.g., authRoutes.js)
module.exports = {
    signIn
};
