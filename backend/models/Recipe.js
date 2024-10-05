const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image_url: { type: String, required: true },
  spoonacular_id: { type: Number, required: true, unique: true },
  ingredients: [{ type: String }],  // This is an array of strings
  instructions: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);