const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
require('dotenv').config({path: __dirname + '/.env'})

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
        // Find or create user in database usually
        return done(null, profile)
  }
));

passport.serializeUser((user, done)=>
{
    done(null, user)
})

passport.deserializeUser((user, done)=>
{
    done(null, user)
})