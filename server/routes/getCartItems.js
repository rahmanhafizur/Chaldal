// CHALDAL/server/routes/getCartItems.js
const express = require('express');
const router = express.Router();
const getCartItemsController = require('../controllers/getCartItemsController'); // Path to your new controller

router.post('/', getCartItemsController.getCartItems);

module.exports = router;
