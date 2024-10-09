const express = require('express');
const axios = require('axios');
const Recipe = require('../models/Recipe');
const router = express.Router();
const apiKey = process.env.SPOONACULAR_API_KEY;

// Helper function to fetch recipe details
async function getRecipeDetails(itemId) {
  const detailUrl = `https://api.spoonacular.com/recipes/${itemId}/information?includeNutrition=false&apiKey=${apiKey}`;
  const detailResponse = await axios.get(detailUrl);
  return detailResponse.data;
}

// Helper function to map recipe data
const mapRecipeData = (recipe) => ({
  id: recipe.id,
  title: recipe.title,
  image_url: recipe.image,
  ingredients: recipe.extendedIngredients.map(ingredient => ingredient.original),
  instructions: recipe.analyzedInstructions[0]?.steps.map(step => step.step).join('\n') || 'No instructions provided'
});

// Route to get a single recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;
    let recipe = await Recipe.findOne({ spoonacular_id: recipeId });

    if (!recipe) {
      console.log('Recipe not found in database, fetching from Spoonacular API');
      const detailedRecipe = await getRecipeDetails(recipeId);
      const mappedRecipe = mapRecipeData(detailedRecipe);

      recipe = await Recipe.findOneAndUpdate(
        { spoonacular_id: mappedRecipe.id },
        {
          title: mappedRecipe.title,
          image_url: mappedRecipe.image_url,
          ingredients: mappedRecipe.ingredients,
          instructions: mappedRecipe.instructions,
          spoonacular_id: mappedRecipe.id
        },
        { upsert: true, new: true, runValidators: true }
      );
    }

    res.json({
      id: recipe.spoonacular_id,
      title: recipe.title,
      image_url: recipe.image_url,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions
    });
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    res.status(500).json({ message: "Error fetching recipe details", error: error.message });
  }
});

// Main route with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 100;
    const skip = (page - 1) * limit;

    console.log('Fetching recipes from database');
    let recipes = await Recipe.find().skip(skip).limit(limit);

    if (recipes.length === 0 && page === 1) {
      console.log('No recipes found in database, fetching from Spoonacular API');
      const spoonacularResponse = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=${limit}&offset=${skip}&diet=vegan&addRecipeInformation=true`);
      console.log('Spoonacular API response:', spoonacularResponse.data);
      const basicRecipes = spoonacularResponse.data.results;

      recipes = await Promise.all(basicRecipes.map(async (basicRecipe) => {
        const detailedRecipe = await getRecipeDetails(basicRecipe.id);
        const mappedRecipe = mapRecipeData(detailedRecipe);
        const savedRecipe = await Recipe.findOneAndUpdate(
          { spoonacular_id: mappedRecipe.id },
          {
            title: mappedRecipe.title,
            image_url: mappedRecipe.image_url,
            ingredients: mappedRecipe.ingredients,
            instructions: mappedRecipe.instructions,
            spoonacular_id: mappedRecipe.id
          },
          { upsert: true, new: true, runValidators: true }
        );
        return {
          id: savedRecipe.spoonacular_id,
          title: savedRecipe.title,
          image_url: savedRecipe.image_url,
          ingredients: savedRecipe.ingredients,
          instructions: savedRecipe.instructions
        };
      }));
    } else {
      recipes = recipes.map(recipe => ({
        id: recipe.spoonacular_id,
        title: recipe.title,
        image_url: recipe.image_url,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions
      }));
    }

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    console.error("Error details:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching recipes", error: error.message });
  }
});

module.exports = router;
