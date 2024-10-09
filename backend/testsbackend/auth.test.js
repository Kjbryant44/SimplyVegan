const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const userRoutes = require('../routes/userRoutes');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connectTestDB = require('../config/testDb');
require('dotenv').config();

const app = express();

// Setup express-session
app.use(session({
  secret: 'test_secret',
  resave: false,
  saveUninitialized: false
}));

// Setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Incorrect password.' });
    }
  } catch (err) {
    return done(err);
  }
}));

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

app.use(express.json());
app.use('/api/users', userRoutes);

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Registration', () => {
  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should not register a user with an existing username', async () => {
    await new User({ username: 'testuser', password: 'testpassword' }).save();
    const response = await request(app)
      .post('/api/users/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Username already exists');
  });
});

describe('User Login', () => {
  it('should log in a user with valid credentials', async () => {
    await new User({ username: 'testuser', password: 'testpassword' }).save();
    const response = await request(app)
      .post('/api/users/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Logged in successfully');
  });
});