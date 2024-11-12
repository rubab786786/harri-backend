// config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Adjust based on your User model path

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists
    let user = await User.findOne({ googleId: profile.id });
    
    // If the user doesn't exist, create one
    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,  // Extract email from Google profile
        name: profile.displayName,       // Extract name from Google profile
        // Do not require a password here
      });
      await user.save();
    }
    
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));
