import React, { useState } from 'react';

const RecipeItem = ({ recipe, isFavorite, onAddToFavorites, onRemoveFromFavorites, showRemoveButton }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleFavoriteClick = () => {
    console.log('Favorite button clicked', recipe.id, isFavorite);
    if (isFavorite && showRemoveButton) {
      console.log('Removing from favorites');
      onRemoveFromFavorites(recipe.id);
    } else if (!isFavorite) {
      console.log('Adding to favorites');
      onAddToFavorites(recipe.id);
    } else {
      console.log('Button clicked but no action taken');
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
          className={`btn ${isFavorite ? 'btn-success' : 'btn-primary'} mr-2`}
          disabled={isFavorite && !showRemoveButton}
        >
          {isFavorite
            ? (showRemoveButton ? 'Remove from Favorites' : 'Added to Favorites')
            : 'Add to Favorites'}
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