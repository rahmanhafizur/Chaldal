// CHALDAL/server/config/db.js
    require('dotenv').config(); // Load environment variables from .env

    const oracledb = require('oracledb');

    // Initialize oracledb client with path to Instant Client
    // This is crucial for oracledb to find the native libraries
    if (process.env.ORACLE_CLIENT_LIB_DIR) {
        oracledb.initOracleClient({ libDir: process.env.ORACLE_CLIENT_LIB_DIR });
    }

    // Configure oracledb for connection pooling (recommended for Node.js apps)
    oracledb.poolMin = 10;
    oracledb.poolMax = 10;
    oracledb.poolIncrement = 0;
    oracledb.poolAlias = 'default';

    async function initialize() {
        try {
            await oracledb.createPool({
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                connectString: process.env.DB_CONNECTION_STRING,
                poolAlias: 'default'
            });
            console.log('Oracle Database Connection Pool created successfully!');
        } catch (err) {
            console.error('Error creating Oracle connection pool:', err);
            // Provide more specific error messages if possible, e.g., if Instant Client is missing
            if (err.message.includes('DPI-1047')) {
                console.error('DPI-1047 Error: Ensure Oracle Instant Client is installed and its path is set in ORACLE_CLIENT_LIB_DIR or system PATH/LD_LIBRARY_PATH.');
            }
            process.exit(1); // Exit if database connection cannot be established
        }
    }

    async function close() {
        try {
            await oracledb.getPool('default').close();
            console.log('Oracle Database Connection Pool closed.');
        } catch (err) {
            console.error('Error closing Oracle connection pool:', err);
        }
    }

    async function getConnection() {
        try {
            return await oracledb.getConnection('default');
        } catch (err) {
            console.error('Error getting connection from pool:', err);
            throw err;
        }
    }

    module.exports = {
        initialize,
        close,
        getConnection
    };
    