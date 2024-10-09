import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import RecipeList from './components/RecipeList';
import Authentication from './components/Authentication';
import Favorites from './components/Favorites';

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    checkCurrentUser().catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      fetchRecipes().catch(console.error);
      fetchFavorites().catch(console.error);
    }
  }, [user]);

  const checkCurrentUser = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/check-auth`, {
        withCredentials: true
      });
      if (response.data.isAuthenticated) {
        setUser(response.data.user);
        console.log('Current user:', response.data.user);
      } else {
        setUser(null);
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error checking current user:', error);
      setUser(null);
    }
  };

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const [recipesResponse, favoritesResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/recipes`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/favorites`, { withCredentials: true })
      ]);

      const favoriteIds = favoritesResponse.data.map(fav => fav.id);
      const recipesWithFavorites = recipesResponse.data.map(recipe => ({
        ...recipe,
        isFavorite: favoriteIds.includes(recipe.id)
      }));

      setRecipes(recipesWithFavorites);
      setFavorites(favoritesResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Error loading recipes. Please try again later.');
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/favorites`, { withCredentials: true });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/api/users/logout`, { withCredentials: true });
      setUser(null);
      setFavorites([]);
      setRecipes(recipes.map(recipe => ({ ...recipe, isFavorite: false })));
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAddToFavorites = async (recipeId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/favorites/add`, { recipeId }, { withCredentials: true });
      setFavorites(prev => [...prev, recipes.find(r => r.id === recipeId)]);
      setRecipes(prevRecipes => prevRecipes.map(r =>
        r.id === recipeId ? { ...r, isFavorite: true } : r
      ));
    } catch (error) {
      console.error('Error adding to favorites:', error.response?.data || error.message);
    }
  };

  const handleRemoveFromFavorites = async (recipeId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/favorites/remove/${recipeId}`, { withCredentials: true });
      setFavorites(prev => prev.filter(fav => fav.id !== recipeId));
      setRecipes(prevRecipes => prevRecipes.map(r =>
        r.id === recipeId ? { ...r, isFavorite: false } : r
      ));
    } catch (error) {
      console.error('Error removing from favorites:', error.response?.data || error.message);
    }
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

return (
  <Router>
    <div>
      <Header user={user} onLogout={handleLogout} />
      <div className="container mt-4">
        {user ? (
          <Routes>
            <Route path="/" element={<Navigate to="/recipes" />} />
            <Route path="/recipes" element={
              <>
                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <RecipeList
                  recipes={filteredRecipes}
                  loading={loading}
                  error={error}
                  onAddToFavorites={handleAddToFavorites}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                />
              </>
            } />
            <Route path="/favorites" element={
              <Favorites
                favorites={favorites}
                onRemoveFromFavorites={handleRemoveFromFavorites}
              />
            } />
          </Routes>
        ) : (
          <Authentication setUser={setUser} />
        )}
      </div>
    </div>
  </Router>
);
};

export default App;