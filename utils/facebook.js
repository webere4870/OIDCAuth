const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
require('dotenv').config({path: __dirname + '/.env'})

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "http://localhost:3000/facebook/callback"
},(accessToken, refreshToken, profile, done)=>
{
    return done(null, profile)
}))

passport.serializeUser(function (user, done) {
    done(null, user);
});
  
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
});