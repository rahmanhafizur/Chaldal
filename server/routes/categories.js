    // CHALDAL/server/routes/categories.js
    const express = require('express');
    const router = express.Router();
    const categoriesController = require('../controllers/categoriesController'); // Path is relative from routes to controllers

    // Define a GET route for fetching all products
    router.get('/', categoriesController.getCategories);

    module.exports = router;
    