import React from 'react';
import RecipeItem from './RecipeItem';

const RecipeList = ({ recipes, loading, error, onAddToFavorites, favorites }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="row">
      {recipes.map((recipe) => (
        <div className="col-md-4" key={recipe.id || recipe._id}>
          <RecipeItem
            recipe={recipe}
            isFavorite={favorites.some(fav => (fav.id || fav._id) === (recipe.id || recipe._id))}
            onAddToFavorites={onAddToFavorites}
          />
        </div>
      ))}
    </div>
  );
};

export default RecipeList;