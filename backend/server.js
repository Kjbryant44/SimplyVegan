const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/recipes', recipeRoutes);

let PORT = process.env.PORT || 5000;

const startServer = async () => {  // Mark the function as async
  try {
    await connectDB();  // Use await here
    console.log('DB Connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.log(`Address in use, retrying on port ${++PORT}`);
        startServer();
      }
    });

  } catch(error) {
    console.error(`DB Connection Error: ${error.message}`);
  }
};

startServer().catch(error => console.error(`Error starting server: ${error.message}`));
