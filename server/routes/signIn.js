// CHALDAL/server/routes/signIn.js
const express = require('express');
const router = express.Router();
const signInController = require('../controllers/signInController'); // Path is relative from routes to controllers

// Define a GET route for fetching all products
router.post('/signIn', signInController.signIn);

module.exports = router;
    