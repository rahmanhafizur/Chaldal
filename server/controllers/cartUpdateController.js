// CHALDAL/server/controllers/cartUpdateController.js
const db = require('../config/db'); // Path to your database configuration
const bcrypt = require('bcryptjs'); // For password hashing

const updateCart = async (req, res) => {
    let connection;
    try {
        // 1. Get user data from the request body
        const { customerId, productId, quantity } = req.body;

        // 2. Basic Server-side Validation
        if (!customerId || !productId || (typeof quantity !== 'number' || quantity < 0)) {
            return res.status(400).json({ message: 'Error passing parameter in updateCart' });
        }

        
        connection = await db.getConnection();
        console.log('Connection to Oracle DB established for cartUpdate.');

        // Check for existing username or email
        const sql1 = `SELECT COUNT(*)
                    FROM CART_ITEM 
                    WHERE CART_ID = 
                    (
                    SELECT CART_ID FROM CART 
                    WHERE CUSTOMER_ID = :customerId
                    )
                    AND PRODUCT_ID = :productId`;

        const count = await connection.execute(sql1, { customerId, productId });

        if (count.rows[0][0] > 0) {
            if(quantity==0) {
                const sql2 =   `DELETE FROM CART_ITEM 
                                WHERE CART_ID = 
                                (
                                SELECT CART_ID FROM CART 
                                WHERE CUSTOMER_ID = :customerId
                                )
                                AND PRODUCT_ID = :productId`;
                
                const result = await connection.execute(sql2, {customerId, productId}, { autoCommit: true });

                if (result.rowsAffected && result.rowsAffected === 1) {
                    console.log('The product is removed from the cart_item table as the quantity is 0.');
                    res.status(201).json({ message: 'cart update successful' }); // 201 Created
                } else {
                    console.error('Failed to delete the item from cart_item. Rows affected:', result.rowsAffected);
                    res.status(500).json({ message: 'Failed to delete item from cart_item. No rows affected.' });
                }
            }

            else {
                const sql3 =    `UPDATE CART_ITEM 
                                SET QUANTITY = :quantity
                                WHERE CART_ID = 
                                (
                                SELECT CART_ID FROM CART 
                                WHERE CUSTOMER_ID = :customerId
                                )
                                AND PRODUCT_ID = :productId`;

                const result2 = await connection.execute(sql3, {quantity, customerId, productId}, { autoCommit: true });

                if (result2.rowsAffected && result2.rowsAffected === 1) {
                    console.log('updated the quntity to the new quantity.');
                    res.status(201).json({ message: 'cart update successful' }); // 201 Created
                } else {
                    console.error('Failed to update the item in cart_item. Rows affected:', result2.rowsAffected);
                    res.status(500).json({ message: 'Failed to update item in cart_item. No rows affected.' });
                }
            }
            
        }

        else {
            if (quantity === 0) {
                console.log('updated the cart.');
                res.status(200).json({ message: 'cart update successful' }); // 200 ok
            }
            else {
                const sql4 =    `INSERT INTO CART_ITEM(CART_ID, PRODUCT_ID, QUANTITY)
                                VALUES((SELECT CART_ID FROM CART WHERE CUSTOMER_ID = :customerId), :productId, :quantity)`;

                const result3 = await connection.execute(sql4, {customerId, productId, quantity}, { autoCommit: true });

                if (result3.rowsAffected && result3.rowsAffected === 1) {
                    console.log('updated the quntity.');
                    res.status(201).json({ message: 'cart update successful' }); // 201 Created
                } else {
                    console.error('Failed to update the item. Rows affected:', result3.rowsAffected);
                    res.status(500).json({ message: 'Failed to update item. No rows affected.' });
                }
            }
        }

    } catch (err) {
        // Handle any errors that occur during the process
        console.error('Error during cartUpdate:', err);
        res.status(500).json({ message: 'Error during updateCart', error: err.message });
    } finally {
        // Always close the database connection
        if (connection) {
            try {
                await connection.close();
                console.log('Connection to Oracle DB released after signup attempt.');
            } catch (err) {
                console.error('Error closing connection after cartUpdate:', err);
            }
        }
    }
};

module.exports = {
    updateCart
};
