const express = require('express');
const axios = require('axios');
const Recipe = require('../models/Recipe');
const router = express.Router();
const apiKey = process.env.SPOONACULAR_API_KEY;

// Fetch recipes from Spoonacular API and update local database
router.get('/fetch', async (req, res) => {
    async function getRecipeDetails(item) {
        const detailUrl = `https://api.spoonacular.com/recipes/${item.id}/information?includeNutrition=false&apiKey=${apiKey}`;
        const detailResponse = await axios.get(detailUrl);
        console.log('Recipe details:', detailResponse.data);
        return detailResponse.data;
    }

    try {
        const query = req.query.query || 'vegan';
        const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&diet=vegan&addRecipeInformation=true`;
        const response = await axios.get(url);
        console.log('API response: ', response.data);
        const recipes = response.data.results;

        for (const item of recipes) {
            const details = await getRecipeDetails(item);
            await Recipe.findOneAndUpdate(
                { spoonacular_id: item.id },
                {
                    title: item.title,
                    image_url: item.image,
                    spoonacular_id: item.id,
                    ingredients: details.extendedIngredients.map(ingredient => ingredient.name),
                    instructions: details.instructions || 'No instructions provided',
                },
                { upsert: true, new: true, runValidators: true }
            );
        }

        res.json(recipes);
    } catch (error) {
        console.error("Error fetching recipes from Spoonacular:", error);
        res.status(500).json({ message: error.message });
    }
});

// Main route with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let recipes = await Recipe.find().skip(skip).limit(limit);

    if (recipes.length === 0 && page === 1) {
      const spoonacularResponse = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=${limit}&offset=${skip}&diet=vegan&addRecipeInformation=true`);
      recipes = spoonacularResponse.data.results;

      if (recipes && recipes.length > 0) {
        await Recipe.insertMany(recipes.map(recipe => ({
          title: recipe.title,
          image_url: recipe.image,
          spoonacular_id: recipe.id,
          ingredients: recipe.extendedIngredients,
          instructions: recipe.instructions || 'No instructions provided',
        })));
      }
    }

    res.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: error.message });
  }
});

// Search functionality
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    let recipes = await Recipe.find({ title: { $regex: query, $options: 'i' } });

    if (recipes.length === 0) {
      const spoonacularResponse = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&diet=vegan&addRecipeInformation=true`);
      recipes = spoonacularResponse.data.results;

      if (recipes && recipes.length > 0) {
        await Recipe.insertMany(recipes.map(recipe => ({
          title: recipe.title,
          image_url: recipe.image,
          spoonacular_id: recipe.id,
          ingredients: recipe.extendedIngredients,
          instructions: recipe.instructions || 'No instructions provided',
        })));
      }
    }

    res.json(recipes);
  } catch (error) {
    console.error("Error searching recipes:", error);
    res.status(500).json({ message: error.message });
  }
});

// Fetch a specific recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ spoonacular_id: req.params.id });
        if (!recipe) {
            return res.status(404).json({ message: 'Cannot find recipe with this ID'});
        }

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (!recipe.updatedAt || recipe.updatedAt < twentyFourHoursAgo) {
            const detailUrl = `https://api.spoonacular.com/recipes/${req.params.id}/information?includeNutrition=false&apiKey=${apiKey}`;
            const detailResponse = await axios.get(detailUrl);
            const updatedRecipe = detailResponse.data;

            await Recipe.findOneAndUpdate(
                { spoonacular_id: req.params.id },
                {
                    title: updatedRecipe.title,
                    image_url: updatedRecipe.image,
                    ingredients: updatedRecipe.extendedIngredients,
                    instructions: updatedRecipe.instructions || 'No instructions provided',
                },
                { new: true, runValidators: true }
            );

            return res.json(updatedRecipe);
        }

        res.json(recipe);
    } catch (error) {
        console.error("Error fetching specific recipe:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;