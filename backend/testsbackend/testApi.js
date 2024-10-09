const axios = require('axios');

async function testApiConnection() {
  try {
    // Test fetching recipes
    console.log('Testing recipe search...');
    const recipesResponse = await axios.get('http://localhost:3000/api/recipes?query=vegan');
    console.log('Recipes API Response:', recipesResponse.data);

    // Test user registration
    console.log('\nTesting user registration...');
    const username = 'testuser' + Date.now();
    const registerResponse = await axios.post('http://localhost:3000/api/users/register', {
      username: username,
      password: 'testpassword'
    });
    console.log('Register API Response:', registerResponse.data);

    // Test login
    console.log('\nTesting user login...');
    const loginResponse = await axios.post('http://localhost:3000/api/users/login', {
      username: username,
      password: 'testpassword'
    });
    console.log('Login API Response:', loginResponse.data);

    // Assuming login returns a token, store it for authenticated requests
    const token = loginResponse.data.token; // Adjust this based on your actual response structure

    // Test viewing recipe details
console.log('\nTesting view recipe details...');
const recipeId = recipesResponse.data[0].id; // Assuming the first recipe from the search
try {
  const recipeDetailsResponse = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`);
  console.log('Recipe Details Response:', recipeDetailsResponse.data);
} catch (error) {
  console.error('API Test Error:', error.response ? error.response.data : error.message);
}

    // Test saving favorite recipe
    console.log('\nTesting save favorite recipe...');
    const saveFavoriteResponse = await axios.post('http://localhost:3000/api/favorites/add',
      { recipeId: recipeId },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log('Save Favorite Response:', saveFavoriteResponse.data);

    // Test viewing favorite recipes
    console.log('\nTesting view favorite recipes...');
    const viewFavoritesResponse = await axios.get('http://localhost:3000/api/favorites',
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log('View Favorites Response:', viewFavoritesResponse.data);

  } catch (error) {
    console.error('API Test Error:', error.response ? error.response.data : error.message);
  }
}

testApiConnection();