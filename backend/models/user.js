// backend/models/user.js
const mongoose = require('mongoose');

// Define the Review Schema with validation
const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true },
  image: { type: String },
  rating: { 
    type: Number, 
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [100, 'Rating cannot exceed 100']
  },
  review: { type: String },
  title: { type: String, required: true },
});

// Define the Media Schema
const mediaSchema = new mongoose.Schema({
  id: { type: String, required: true },
  media: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String },
});

// Define the User Schema with indexes and validation
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  completed: [mediaSchema],  // Array of media objects
  current: [mediaSchema],    // Array of media objects
  futures: [mediaSchema],    // Array of media objects
  favorites: [mediaSchema],  // Array of media objects
  reviews: [reviewSchema],   // Array of review objects
}, { collection: 'User-test' }); // Specify the collection name

// Create unique indexes for username and email fields
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

