const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();


// User registration route
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Registering user:', username);

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Username already exists');
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// User login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return next(err);
    }
    if (!user) {
      console.error('Authentication failed:', info.message);
      return res.status(400).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return next(err);
        }
        console.log('User logged in:', user);
        return res.json({ message: 'Logged in successfully', user: { id: user._id, username: user.username } });
      });
    });
  })(req, res, next);
});

// User logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out', error: err.message });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user route
router.get('/current-user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: { id: req.user._id, username: req.user.username } });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

module.exports = router;