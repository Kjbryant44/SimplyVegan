import React, { useState } from 'react';

const RecipeItem = ({ recipe, onAddToFavorites, onRemoveFromFavorites, showRemoveButton }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleFavoriteClick = () => {
    if (recipe.isFavorite) {
      onRemoveFromFavorites(recipe.id);
    } else {
      onAddToFavorites(recipe.id);
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="card mb-4">
      <img src={recipe.image_url} className="card-img-top" alt={recipe.title} />
      <div className="card-body">
        <h5 className="card-title">{recipe.title}</h5>
        <button
          onClick={handleFavoriteClick}
          className={`btn ${recipe.isFavorite ? 'btn-danger' : 'btn-primary'} mr-2`}
        >
          {showRemoveButton ? 'Delete' : (recipe.isFavorite ? 'Added to Favorites' : 'Add to Favorites')}
        </button>
        <button onClick={toggleDetails} className="btn btn-info">
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        {showDetails && (
          <div className="mt-3">
            <h6>Ingredients:</h6>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h6>Instructions:</h6>
            <p>{recipe.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeItem;