import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecipeItem from './RecipeItem';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await axios.get('/api/recipes/fetch');
      setRecipes(response.data);
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      <h1>Recipes</h1>
      <div>
        {recipes.map((recipe) => (
          <RecipeItem key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
