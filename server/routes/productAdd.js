// CHALDAL/server/routes/productAdd.js
const express = require('express');
const router = express.Router();
const productAddController = require('../controllers/productAddController'); // Path is relative from routes to controllers

router.post('/productAdd', productAddController.productAdd);

module.exports = router;
    