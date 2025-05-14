import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// OAuth credentials
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Configure Passport GitHub strategy
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    userAgent: 'MyApp/1.0.0'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('GitHub Access Token:', accessToken);
    // In a real app, you would save or update the user in your database
    // Here, we're just passing the profile on
    return done(null, profile);
  }
));

// Configure Passport Google strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('Google Access Token:', accessToken);
    // In a real app, you would save or update the user in your database
    // Here, we're just passing the profile on
    return done(null, profile);
  }
));

// Serialize/Deserialize user
passport.serializeUser((user, done) => {
  // We can store some user identifier in the session
  // For simplicity, we're storing the whole profile but in production
  // you might want to just store the user ID
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  // In a real app, you would look up the user in your database
  // using the ID stored in the session
  done(null, obj);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static('public'));

// GitHub Auth routes
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback', 
  function(req, res, next) {
    passport.authenticate('github', function(err, user, info) {
      if (err) {
        console.error('GitHub Auth Error:', err);
        return res.redirect('/');
      }
      
      if (!user) {
        console.log('No user returned from GitHub');
        return res.redirect('/');
      }
      
      req.logIn(user, function(err) {
        if (err) {
          console.error('Login error:', err);
          return next(err);
        }
        return res.redirect('/profile');
      });
    })(req, res, next);
  }
);

// Google Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  function(req, res, next) {
    passport.authenticate('google', function(err, user, info) {
      if (err) {
        console.error('Google Auth Error:', err);
        return res.redirect('/');
      }
      
      if (!user) {
        console.log('No user returned from Google');
        return res.redirect('/');
      }
      
      req.logIn(user, function(err) {
        if (err) {
          console.error('Login error:', err);
          return next(err);
        }
        return res.redirect('/profile');
      });
    })(req, res, next);
  }
);

// Get user info
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    // Determine the provider
    const provider = req.user.provider;
    
    res.json({
      authenticated: true,
      provider: provider,
      user: {
        id: req.user.id,
        username: req.user.username || req.user.displayName,
        displayName: req.user.displayName,
        photos: req.user.photos,
        emails: req.user.emails
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Logout route
app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { 
      console.error('Logout error:', err);
      return next(err); 
    }
    res.redirect('/');
  });
});

// Protected route - example
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
  } else {
    res.redirect('/');
  }
});

// Simple home route in case there are issues with static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});