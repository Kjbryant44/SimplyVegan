const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  console.log('Checking authentication:', req.isAuthenticated());
  console.log('Session:', req.session);
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'You must be logged in to perform this action' });
};

// Add a recipe to favorites
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const { recipeId } = req.body;
    console.log('Attempting to add recipe to favorites:', recipeId);
    console.log('User ID:', req.user._id);

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const recipe = await Recipe.findOne({ spoonacular_id: recipeId });
    if (!recipe) {
      console.log('Recipe not found in database:', recipeId);
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (user.favorites.includes(recipe._id)) {
      console.log('Recipe already in favorites');
      return res.status(400).json({ message: 'Recipe already in favorites' });
    }

    user.favorites.push(recipe._id);
    await user.save();
    console.log('Recipe added to favorites successfully');
    res.json({ message: 'Recipe added to favorites', recipe: recipe });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Error adding favorite', error: error.message });
  }
});

// Remove a recipe from favorites
router.delete('/remove/:recipeId', isAuthenticated, async (req, res) => {
  try {
    const { recipeId } = req.params;
    console.log('Attempting to remove favorite with ID:', recipeId);
    console.log('User ID:', req.user._id);

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const recipe = await Recipe.findOne({ spoonacular_id: recipeId });
    if (!recipe) {
      console.log('Recipe not found');
      return res.status(404).json({ message: 'Recipe not found' });
    }

    user.favorites = user.favorites.filter(id => !id.equals(recipe._id));
    await user.save();
    console.log('Favorite removed successfully');
    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Error removing favorite', error: error.message });
  }
});

// Get all favorites for a user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    const favorites = user.favorites.map(recipe => ({
      id: recipe.spoonacular_id,
      title: recipe.title,
      image_url: recipe.image_url,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      isFavorite: true
    }));
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
});

module.exports = router;