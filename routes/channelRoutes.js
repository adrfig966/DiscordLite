//Set up example express route

const express = require('express');
const router = express.Router();

//Create test route
router.get('/', (req, res) => {
    res.json({ message: 'Channel route works' });
    }
);

//Export router

module.exports = router;