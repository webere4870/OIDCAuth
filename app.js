const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
require('dotenv').config({path: __dirname + '/.env'})
const cookieParser = require('cookie-parser')
const passport = require('passport')
const MongoStore = require('connect-mongo')

require('./utils/google')
require('./utils/facebook')
require('./utils/github')
require('./utils/database')


app.use(express.static(__dirname + "/static"))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
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



app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use('/', require('./routes/root'))


app.listen(3000, ()=>
{
    console.log("Listening on port 3000...")
})