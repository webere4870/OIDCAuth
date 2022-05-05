const passport = require('passport')
const PassportJWT = require('passport-jwt').Strategy
const cookieExtractor = (req, res) =>
{
    let jwt = null;

    if(req && req.cookies)
    {
        jwt = req.cookies['jwt']
    }
}


// Go through and add private key
passport.use('jwt', new PassportJWT({jwtFromRequest: cookieExtractor,
    secretOrKey: 'secret'}, (jwtpayload, done)=>
{
    if(Date.now() > jwtpayload.expiration)
    {
        done('unauthorized', false)
    }

    console.log(jwtpayload)

    done(null, jwtpayload)
}))