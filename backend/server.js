const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Import route files 
const spotifyRoutes = require('./routes/spotifyRoutes');
const accountRoutes = require('./routes/accountRoutes');
const listRoutes = require('./routes/listRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/searchRoutes');
const igdbAuthRoutes = require('./routes/igdbRoutes');

// Environment config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Mongo Connection
const mongoUri = process.env.MONGO_URI;

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
app.use('/api/accounts', accountRoutes);
app.use('/api/list', listRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/auth/igdb', igdbAuthRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}); 

