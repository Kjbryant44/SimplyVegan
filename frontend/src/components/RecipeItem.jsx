import React from 'react';

const RecipeItem = ({ recipe, isFavorite, onAddToFavorites }) => {
  const handleFavoriteClick = () => {
    if (!isFavorite) {
      onAddToFavorites(recipe.id || recipe._id);
    }
  };

  return (
    <div className="card mb-4">
      <img src={recipe.image_url} className="card-img-top" alt={recipe.title} />
      <div className="card-body">
        <h5 className="card-title">{recipe.title}</h5>
        <button
          onClick={handleFavoriteClick}
          className={`btn ${isFavorite ? 'btn-success' : 'btn-primary'}`}
          disabled={isFavorite}
        >
          {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

export default RecipeItem;