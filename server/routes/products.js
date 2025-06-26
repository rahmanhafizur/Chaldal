    // CHALDAL/server/routes/products.js
    const express = require('express');
    const router = express.Router();
    const productController = require('../controllers/productController'); // Path is relative from routes to controllers

    // Define a GET route for fetching all products
    router.get('/', productController.getProducts);

    module.exports = router;
    