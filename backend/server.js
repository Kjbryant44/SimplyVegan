//Existing dependencies import
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User');  // change this path to actual user model path

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/recipes', recipeRoutes);

//Passport.js Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if (result) {
          return done(null, user);
        } else {
         return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Existing application setup
let PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
  } catch (error) {
    console.error(`Error occurred while starting the server: ${error.message}`);
  }
};

startServer().catch();

// Existing middleware setup
app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.use((err, req, res) => {
  console.error('An unexpected error occurred: ', err);
  res.status(500).send('An unexpected error occurred on the server');
});