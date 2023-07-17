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
    jwt.sign({ id: req.user }, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error signing token', raw: err });
        } else {
            res.json({ message: 'User logged in', token: token });
        }
    });
});


//Export router

module.exports = router;