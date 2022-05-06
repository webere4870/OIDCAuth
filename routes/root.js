const express = require('express')
const passport = require('passport')
const authenticationArray = require('./../utils/authenticate')
const Router = express.Router()
const Users = require('mongoose').model("JWTUsers")
const {verifyUser, createJWT, createUser} = require('./../utils/jwt')
const dayjs = require('dayjs')

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

Router.get('/auth/github', passport.authenticate('github',{ scope: [ 'user:email' ] }))

Router.get('/auth/github/callback',passport.authenticate('github', { failureRedirect: '/auth/error' }),
function(req, res) {
  res.redirect('/');
});

Router.get('/facebook/callback', passport.authenticate('facebook',
{
    successRedirect:"/protected",
    failureRedirect: "/"
}))

Router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['openid', 'public_profile', 'email']
}))

Router.get('/register', (req, res)=>
{
    res.render('register')
})

Router.post('/register', async (req, res)=>
{
    let {username, password} = req.body;
    let user = await createUser(username, password)
    Users.create(user)
    let jwt = createJWT(username, "jwt")
    let refreshJWT = createJWT(username, "refresh")
    res.cookie("secureCookie", JSON.stringify(jwt), {
        httpOnly: true,
        expires: dayjs().add(30, "days").toDate(),
      });
    res.redirect("/")
})


Router.post('/login', async (req, res)=>
{
    let{username, password} = req.body
    let user = await Users.findOne({username: username})
    console.log(user)
    let isValid = await verifyUser(password, user.salt, user.hash)
    if(isValid == true)
    {
        let jwt = createJWT(username)
        let refreshJWT = createJWT(username, "refresh")
        res.cookie("secureCookie", JSON.stringify(jwt), {
            httpOnly: true,
            expires: dayjs().add(30, "days").toDate(),
        });
        res.redirect("/protected")
    }
    else{
        res.redirect("/")
    }
})
  
Router.get("/dashboard",(req, res) => {
    res.render("dashboard");
});

Router.get('/protected', authenticationArray, (req, res)=>
{
    // Access image option
    // {img: req.session.passport.user.picture}
    res.render('protected')
})
  
Router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy()
    req.session = null
    res.clearCookie("secureCookie")
    res.redirect("/");
});

module.exports = Router
