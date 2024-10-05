import React from 'react';
import RecipeItem from './RecipeItem';

const RecipeList = ({ recipes, loading, error, onAddToFavorites, onRemoveFromFavorites }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="row">
      {recipes.map(recipe => (
        <div key={recipe.id} className="col-md-4 mb-4">
          <RecipeItem
            recipe={recipe}
            isFavorite={recipe.isFavorite}
            onAddToFavorites={onAddToFavorites}
            onRemoveFromFavorites={onRemoveFromFavorites}
            showRemoveButton={false}
          />
        </div>
      ))}
    </div>
  );
};

export default RecipeList;