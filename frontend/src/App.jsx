import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    fetchRecipes().catch(console.error);
    checkCurrentUser().catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavorites().catch(console.error);
    }
  }, [user]);

  const checkCurrentUser = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/current-user`, { withCredentials: true });
      setUser(response.data.user);
      console.log('Current user:', response.data.user);
    } catch (error) {
      console.error('Error checking current user:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes`);
      setRecipes(response.data);
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
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

const handleAddToFavorites = async (recipeId) => {
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/favorites/add`, { recipeId }, { withCredentials: true });
    const newFavorite = recipes.find(recipe => (recipe.id || recipe._id) === recipeId);
    setFavorites(prevFavorites => [...prevFavorites, newFavorite]);
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

const handleRemoveFromFavorites = async (recipeId) => {
  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/favorites/remove/${recipeId}`, { withCredentials: true });
    setFavorites(prevFavorites => prevFavorites.filter(fav => (fav.id || fav._id) !== recipeId));
  } catch (error) {
    console.error('Error removing from favorites:', error);
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
              <Route path="/" element={
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
                    favorites={favorites}
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