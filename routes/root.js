const express = require('express')
const passport = require('passport')
const isLoggedIn = require('./../utils/authenticate')
const Router = express.Router()

Router.get("/", (req, res) => {
    res.render("index");
});


Router.get('/auth/google', passport.authenticate('google', { scope: [ 'openid', 'email','profile' ] }))


Router.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

Router.get('/facebook/callback', passport.authenticate('facebook',
{
    successRedirect:"/protected",
    failureRedirect: "/"
}))

Router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['openid', 'public_profile', 'email']
}))


Router.post('/session', (req, res)=>
{
    req.session.username = req.body.username
    res.redirect("/dashboard")
})
  
Router.get("/dashboard",(req, res) => {
    res.render("dashboard");
});

Router.get('/protected', isLoggedIn,(req, res)=>
{
    res.render('protected', {img: req.session.passport.user.picture})
})
  
Router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy()
    req.session = null
    res.redirect("/");
});

module.exports = Router
