import React from 'react';
import RecipeItem from './RecipeItem';

const Favorites = ({ favorites, onRemoveFromFavorites }) => {
  if (favorites.length === 0) {
    return <p>No favorite recipes yet.</p>;
  }

  return (
    <div className="container">
      <h1 className="mt-4 mb-4">My Favorites</h1>
      <div className="row">
        {favorites.map((recipe) => (
          <div className="col-md-4" key={recipe.id}>
            <RecipeItem
              recipe={{...recipe, isFavorite: true}}
              onAddToFavorites={() => {}}
              onRemoveFromFavorites={onRemoveFromFavorites}
              showRemoveButton={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;