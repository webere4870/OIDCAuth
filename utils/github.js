const passport = require('passport')
const GithubStrategy = require('passport-github2').Strategy
require('dotenv').config({path: __dirname + '/.env'})

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GithubStrategy(
{
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
}, (accessToken, refreshToken, profile, next)=>
{
    return next(null, profile)
}))
