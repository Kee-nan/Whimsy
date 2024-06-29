const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Import route files 
const omdbRoutes = require('./routes/omdbRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');

// Environment config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use route files
app.use('/api/omdb', omdbRoutes);
app.use('/auth/spotify', spotifyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
