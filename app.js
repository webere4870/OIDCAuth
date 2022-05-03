const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
require('dotenv').config({path: __dirname + '/.env'})
const { ExpressOIDC } = require("@okta/oidc-middleware");
const cookieParser = require('cookie-parser')
const passport = require('passport')
const MongoStore = require('connect-mongo')
require('./utils/google')

let oidc = new ExpressOIDC({
    issuer: "https://dev-37037759.okta.com/oauth2/default",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    appBaseUrl: "http://localhost:3000",
    routes: {
      loginCallback: {
        afterCallback: "/dashboard"
      }
    },
    scope: 'openid profile'
});

function isLoggedIn(req, res, next)
{
    console.log(req.session)
    req.user ? next() : res.status(401).send("<h1>Not found</h1>")
}

function customAuthentication(req, res, next)
{
    if(req.session.username)
    {
        return next()
    }
    else
    {
        return oidc.ensureAuthenticated()
    }
}

app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use(session({
    cookie: { httpOnly: true, maxAge: 100000 },
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URI, //YOUR MONGODB URL
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native' 
    })
}));

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(__dirname + "/static"))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(oidc.router)
app.get("/", (req, res) => {
    res.render("index");
});

app.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }))

app.get( '/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

app.post('/session', (req, res)=>
{
    req.session.username = req.body.username
    res.redirect("/dashboard")
})
  
app.get("/dashboard",(req, res) => {
    res.render("dashboard");
});

app.get('/protected', isLoggedIn,(req, res)=>
{
    res.render('protected')
})
  
app.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy()
    req.session = null
    res.redirect("/");
});

oidc.on("ready", () => {
    app.listen(3000, ()=>
    {
        console.log("Listening on 3000...")
    });
});
  
oidc.on("error", err => {
    console.error(err);
});