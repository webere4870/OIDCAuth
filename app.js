const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
require('dotenv').config({path: __dirname + '/.env'})
const { ExpressOIDC } = require("@okta/oidc-middleware");
const cookieParser = require('cookie-parser')

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
    res.redirect('index')
}
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use(session({
    cookie: { httpOnly: true },
    secret: process.env.SESSION_SECRET
}));


app.use(express.static(__dirname + "/static"))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(oidc.router)
app.get("/", (req, res) => {
    res.render("index");
});

app.post('/session', (req, res)=>
{
    req.session.username = req.body.username
    res.redirect("/dashboard")
})
  
app.get("/dashboard", [customAuthentication, oidc.ensureAuthenticated()],(req, res) => {
    console.log(req.session.username, req.session)
    res.render("dashboard");
});
  
app.get("/logout", (req, res) => {
    req.logout();
    req.session.username = null
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