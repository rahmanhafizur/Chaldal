// CHALDAL/server/app.js

require('dotenv').config(); // Load environment variables first (looks for .env in current directory)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Import the 'path' module to work with file paths correctly

const db = require('./config/db'); // Path is relative from app.js to config
const productRoutes = require('./routes/products'); // Path is relative from app.js to routes
const categoriesRoutes = require('./routes/categories');

const productAdd = require('./routes/productAdd');

const signInRoutes = require('./routes/signIn');
const signUpRoutes = require('./routes/signUp');
const cartUpdateRoutes = require('./routes/cartUpdate');
const getCartItemsRoutes = require('./routes/getCartItems');

const app = express();
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// Middleware
app.use(cors()); // Enable CORS for all routes (important for frontend communication)
app.use(bodyParser.json()); // Parse JSON request bodies

// API Routes - These should come before static file serving to prioritize API calls
app.use('/api/products', productRoutes);
app.use('/api/categories', categoriesRoutes);

app.use('/api/productsAdd', productAdd);

app.use('/api/auth', signInRoutes);
app.use('/api/auth', signUpRoutes);
app.use('/api/cartUpdate', cartUpdateRoutes);
app.use('/api/getCartItems', getCartItemsRoutes);


// --- NEW ADDITIONS TO SERVE REACT FRONTEND ---
// This middleware serves static files from the 'build' directory of your React app.
// When you run 'npm run build' in your client folder, it creates this 'build' directory
// with your optimized HTML, CSS, and JavaScript.
// 'path.join(__dirname, '../client/build')' correctly points to that directory:
// __dirname is the current directory (server/)
// '../client/build' goes up one level (CHALDAL/) then into client/build
app.use(express.static(path.join(__dirname, '../client/build')));

// This is a catch-all route that acts as middleware.
// If Express hasn't responded to a request by this point (i.e., no API route or static file matched),
// it will serve the 'index.html' file from your React app's build directory.
// This is essential for single-page applications (SPAs) and client-side routing,
// ensuring that refreshing a page or directly navigating to a React route
// (e.g., /products or /about) still loads your React application.
// This approach is often more robust than app.get('*') for some setups.
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
// --- END NEW ADDITIONS ---

// Initialize database connection pool and start the server
db.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Backend server running on port ${PORT}`);
            console.log(`Frontend (React app) is now served from http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to start backend server:', err);
        process.exit(1); // Exit with error if DB connection fails
    });

// Handle graceful shutdown signals (optional but good practice)
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received. Closing Oracle connection pool.');
    await db.close();
    console.log('Server gracefully shut down.');
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal received. Closing Oracle connection pool.');
    await db.close();
    console.log('Server gracefully shut down.');
    process.exit(0);
});
