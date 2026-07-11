/**
 * Passport Configuration
 * Configures Google OAuth 2.0 strategy
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');

/**
 * Google OAuth Strategy Configuration
 * Only configured if environment variables are set
 */
const isGoogleAuthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

if (isGoogleAuthConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Google did not provide an email address'));
          }

          // Check if user already exists
          let user = await User.findOne({ email });

          if (user) {
            // User exists, return user
            return done(null, user);
          } else {
            // Create new user
            user = await User.create({
              name: profile.displayName,
              email,
              // OAuth users do not know this password; hashing prevents a
              // plaintext credential from being stored in the database.
              password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10),
              location: null,
              farmLocation: null,
              cropType: null,
            });
            return done(null, user);
          }
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.log('⚠️  Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)');
}

/**
 * Serialize user for session
 */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/**
 * Deserialize user from session
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
module.exports.isGoogleAuthConfigured = isGoogleAuthConfigured;
