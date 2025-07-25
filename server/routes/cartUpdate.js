// CHALDAL/server/routes/cartUpdate.js
const express = require('express');
const router = express.Router();
const cartUpdateController = require('../controllers/cartUpdateController'); // Path to your new controller

// Define a POST route for user signup
// This route will handle requests to /api/auth/signup
router.post('/update', cartUpdateController.updateCart);

module.exports = router;
