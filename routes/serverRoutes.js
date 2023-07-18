const express = require('express');
const router = express.Router();
const passport = require('passport');
const Server = require('../models/server');

//Create test route
router.get('/', (req, res) => {
    res.json({ message: 'Server route works' });
    }
);

//Create a server
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Missing required parameter: name' });
    } else {
        const newServer = new Server({
            name: name,
            owner: req.user._id,
            members: [req.user._id]
        });
        newServer.save()
            .then((server) => {
                res.json({ message: 'Server created', server: server });
            })
            .catch((error) => {
                res.status(500).json({ error: 'Error creating server', raw: error });
            });
    }
});

//Get all servers owned by the user
router.get('/owned', passport.authenticate('jwt', { session: false }), (req, res) => {
    Server.find({ owner: req.user._id })
        .then((servers) => {
            res.json({ message: 'Servers found', servers: servers });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error finding servers', raw: error });
        });
});

//Get all servers the user is a member of
router.get('/list', passport.authenticate('jwt', { session: false }), (req, res) => {
    Server.find({ members: req.user._id })
        .then((servers) => {
            res.json({ message: 'Servers found', servers: servers });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error finding servers', raw: error });
        });
});

//Get a server by id. Check if user is a member of the server
router.get('/list/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Server.findById(req.params.id)
        .then((server) => {
            if (server) {
                if (server.members.includes(req.user._id)) {
                    res.json({ message: 'Server found', server: server });
                } else {
                    res.status(403).json({ error: 'Access denied' });
                }
            } else {
                res.status(404).json({ error: 'Server not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error finding server', raw: error });
        });
});

//Update a server by id. Check if user is the owner of the server
router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Server.findById(req.params.id)
        .then((server) => {
            if (server) {
                if (server.owner.equals(req.user._id)) {
                    const { name, description, icon, type } = req.body;
                    if (name) {
                        server.name = name;
                    }
                    if (description) {
                        server.description = description;
                    }
                    if (icon) {
                        server.icon = icon;
                    }
                    if (type) {
                        server.type = type;
                    }
                    server.save()
                        .then((server) => {
                            res.json({ message: 'Server updated', server: server });
                        })
                        .catch((error) => {
                            res.status(500).json({ error: 'Error updating server', raw: error });
                        });
                } else {
                    res.status(403).json({ error: 'Access denied' });
                }
            } else {
                res.status(404).json({ error: 'Server not found' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error finding server', raw: error });
        });
});


//Export router

module.exports = router;