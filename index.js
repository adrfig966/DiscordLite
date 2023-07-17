require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const app = express();

const databaseurls = {
  'dev': process.env.DEVDB,
  'test': process.env.TESTDB,
};

if(process.env.NODE_ENV) {
  console.log(`Running in ${process.env.NODE_ENV} mode`);
}

// Connect to the database
mongoose
  .connect(process.env.NODE_ENV ? databaseurls[process.env.NODE_ENV] : process.env.DEVDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// Require necessary dependencies
const userRoutes = require('./routes/userRoutes');
const channelRoutes = require('./routes/channelRoutes');
// ... Require other route files as needed

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define route handlers
app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);
// ... Use other route files as needed

// Define a catch-all route for any unrecognized routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
