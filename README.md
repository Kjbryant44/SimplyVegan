# Simply Vegan - Recipe Web Application

## Description
Simply Vegan is a full-stack web application that allows users to discover, search, and save vegan recipes. Built using the MERN stack (MongoDB, Express, React, Node.js), this project serves as a practical introduction to full-stack development.

## Features
- User registration and authentication
- Browse vegan recipes sourced from the Spoonacular API
- Search functionality to find recipes by ingredients or name
- Ability to save favorite recipes
- View detailed recipe information including ingredients and instructions

## Technologies Used
- Frontend: React, React Router, Bootstrap
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: Passport.js
- API: Spoonacular for recipe data
- Containerization: Docker

## Local Setup and Installation
1. Clone the repository
   git clone https://github.com/Kjbryant44/SimplyVegan.git
2. Install dependencies for backend

   cd backend
npm install

3. Install dependencies for frontend

cd ../frontend
npm install

4. Start the backend server

cd backend
npm start


5. Start the frontend application

cd frontend
npm start

6. Open your browser and navigate to `http://localhost:3001`

### When Using Docker
1. Ensure Docker and Docker Compose are installed on your system.
2. Clone the repository: `git clone https://github.com/Kjbryant44/SimplyVegan.git`
3. Navigate to the project directory: `cd SimplyVegan`
4. Build and run the Docker containers: `docker-compose up --build`
5. Open your browser and navigate to `http://localhost:3001`

## Usage
- Register for an account or log in
- Browse recipes on the home page
- Use the search bar to find specific recipes by ingredient
- Click on a recipes show details button to view ingredients and instructions
- Add recipes to your favorites list
- View and manage your favorites in the Favorites section
