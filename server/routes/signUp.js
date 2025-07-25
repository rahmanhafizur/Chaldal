// CHALDAL/server/routes/signUp.js
const express = require('express');
const router = express.Router();
const signUpController = require('../controllers/signUpController'); // Path to your new controller

// Define a POST route for user signup
// This route will handle requests to /api/auth/signup
router.post('/signUp', signUpController.signUp);

module.exports = router;
