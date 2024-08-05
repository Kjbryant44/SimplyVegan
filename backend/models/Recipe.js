const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  spoonacular_id: {
    type: Number,
    unique: true,
    required: true,
  },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
