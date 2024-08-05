const express = require('express');
const axios = require('axios');
const Recipe = require('../models/Recipe');
const router = express.Router();
const apiKey = process.env.SPOONACULAR_API_KEY;  // Make apiKey available for all functions

// Fetch recipes from Spoonacular API
router.get('/fetch', async (req, res) => {
    async function getRecipeDetails(item) {
        const detailUrl = `https://api.spoonacular.com/recipes/${item.id}/information?includeNutrition=false&apiKey=${apiKey}`;
        const detailResponse = await axios.get(detailUrl);
        const extendedIngredients = detailResponse.data.extendedIngredients;
        return { ...detailResponse.data, extendedIngredients };
    }

    try {
        const query = req.query.query || 'vegan';
        const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${query}&diet=vegan`;
        const response = await axios.get(url);
        const recipes = response.data.results;

        for (const item of recipes) {
            const details = await getRecipeDetails(item);  // Call the function and get the detailed data

            await Recipe.findOneAndUpdate(
            { spoonacular_id: item.id },
            {
                title: item.title,
                image_url: item.image,
                ingredients: details.extendedIngredients, // Use the detailed data
                instructions: details.instructions, // Use the detailed data
            },
            { upsert: true }
            );
        }

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch recipes from local database
router.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        // If the document with the given ID is not found findById will return null:
        if (recipe === null) {
            return res.status(404).json({ message: 'Cannot find recipe with this ID'});
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;