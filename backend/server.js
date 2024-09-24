const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes'); // Added: Import user routes
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const cors = require('cors');
const favoriteRoutes = require('./routes/favoriteRoutes');

dotenv.config();

const app = express();

// Updated: CORS configuration to allow credentials and specify origin
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
console.log('CORS configured for origin:', 'http://localhost:3001');

app.use(express.json());

connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch(err => {
    console.error("There was an error connecting to the database", err);
  });

// Updated: Session configuration
if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET is not set in the environment variables');
  process.exit(1);
}
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

//  Passport Local Strategy configuration
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect password.' });
    }
  } catch (err) {
    return done(err);
  }
}));

// Updated: Passport serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/favorites', favoriteRoutes);

// Example route
app.get('/', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  res.send(`You have visited this page ${req.session.views} times.`);
});

// Middleware for 404 - Not Found
app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('An unexpected error occurred:', err);
  res.status(500).json({ message: 'An unexpected error occurred on the server', error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));