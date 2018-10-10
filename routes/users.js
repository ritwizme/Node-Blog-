
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
module.exports = router;


//User Login route
router.get('/login', (req, res) => {
    res.send('Login');
});

//User Register route
router.get('/register', (req, res) => {
    res.send('Register');
});




