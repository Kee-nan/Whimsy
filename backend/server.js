const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import route files 
const spotifyRoutes = require('./routes/spotifyRoutes');
const booksRoutes = require('./routes/booksRoutes'); // Import books route
const moviesRoutes = require('./routes/moviesRoutes'); // Import movies route


// Environment config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use route files
app.use('/auth/spotify', spotifyRoutes);
app.use('/api/books', booksRoutes); // Use books route
app.use('/api/movies', moviesRoutes); // Use movies route



// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
