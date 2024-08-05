import React from 'react';

const RecipeItem = ({ recipe }) => {
  return (
    <div>
      <h2>{recipe.title}</h2>
      <img src={recipe.image_url} alt={recipe.title} />
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <p>{recipe.instructions}</p>
    </div>
  );
};

export default RecipeItem;