const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  aisle: String,
  image: String,
  consistency: String,
  name: { type: String, required: true },
  nameClean: String,
  original: { type: String, required: true },
  originalName: String,
  amount: { type: Number, required: true },
  unit: String,
  meta: [String],
  measures: {
    us: {
      amount: { type: Number, required: true },
      unitShort: String,
      unitLong: String
    },
    metric: {
      amount: { type: Number, required: true },
      unitShort: String,
      unitLong: String
    }
  }
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image_url: { type: String, required: true },
  spoonacular_id: { type: Number, required: true, unique: true },
  ingredients: [IngredientSchema],
  instructions: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);