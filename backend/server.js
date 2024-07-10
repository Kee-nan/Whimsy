const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Import route files 
const spotifyRoutes = require('./routes/spotifyRoutes');
const booksRoutes = require('./routes/booksRoutes'); // Import books route
const moviesRoutes = require('./routes/moviesRoutes'); // Import movies route
const accountRoutes = require('./routes/accountRoutes'); // Import accounts route


// Environment config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Mongo Connection
const mongoUri = process.env.MONGO_URI

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use(cors());
app.use(express.json());

// Use route files
app.use('/auth/spotify', spotifyRoutes);
app.use('/api/books', booksRoutes); // Use books route
app.use('/api/movies', moviesRoutes); // Use movies route
app.use('/api/accounts', accountRoutes); // Use accounts route

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
