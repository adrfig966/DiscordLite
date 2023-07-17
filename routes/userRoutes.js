//Set up example express route

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const passportConfig = require('../passportConfig');
const router = express.Router();

passportConfig(passport);

//Create test route
router.get('/', (req, res) => {
    res.json({ message: 'User route works' });
    }
);

router.post('/register', passport.authenticate('local-signup', { session: false }), (req, res) => {
    res.json({ message: 'User registered', user: req.user });
});

router.post('/login', passport.authenticate('local-login', { session: false }), (req, res) => {
    jwt.sign({ user: req.user }, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) {
            res.status(500).json({ error: 'Error signing token', raw: err });
        } else {
            res.json({ message: 'User logged in', token: token });
        }
    });
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'User authenticated', user: req.user });
});


//Export router

module.exports = router;