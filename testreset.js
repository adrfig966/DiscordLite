require('dotenv').config()
const mongoose = require('mongoose'); 

// Retrieve the collection names from the command-line arguments
const collectionNames = process.argv.slice(2);

// Connect to the MongoDB database
mongoose
  .connect(process.env.TESTDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database');
    // Create an array of delete operations
    const deleteOperations = collectionNames.map((collectionName) => {
      // Get a reference to the collection
      const collection = mongoose.connection.collection(collectionName);

      // Remove all documents from the collection
      return collection.deleteMany().then((result) => {
        console.log(`${result.deletedCount} documents deleted from collection '${collectionName}'.`);
      });
    });

    // Wait for all delete operations to complete
    return Promise.all(deleteOperations);
  })
  .then(() => {
    console.log('All collections processed.');
    mongoose.connection.close(); // Close the database connection
  })
  .catch((error) => {
    console.error('Error:', error);
    mongoose.connection.close(); // Close the database connection in case of an error
  });
