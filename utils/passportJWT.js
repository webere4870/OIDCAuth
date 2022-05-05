const passport = require('passport')
const PassportJWT = require('passport-jwt').Strategy
const jsonwebtoken = require('jsonwebtoken')
const cookieExtractor = async (req, res) =>
{
    let jwt = null;
    if(req && req.cookies)
    {
        jwt = req.cookies.secureCookie
    }
    let newJWT = JSON.parse(jwt)
    let jjj = jsonwebtoken.verify(newJWT, 'secret')
    console.log(jjj)
    return newJWT
}


// Go through and add private key
passport.use(new PassportJWT({jwtFromRequest: cookieExtractor,
    secretOrKey: "secret"}, (jwtpayload, done)=>
{
    console.log("Here mighty!")
    if(Date.now() > jwtpayload.expiration)
    {
        done('unauthorized', false)
    }

    console.log(jwtpayload)

    done(null, jwtpayload)
}))