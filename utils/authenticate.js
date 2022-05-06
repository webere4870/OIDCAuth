const jsonwebtoken = require('jsonwebtoken')
const {createJWT} = require('./../utils/jwt')
const dayjs = require('dayjs')
function isLoggedIn(req, res, next)
{
    console.log("here")
    if(req.jwt)
    {
        console.log(req.headers)
        res.clearCookie("secureCookie")
        let jwt = createJWT(req.jwt.sub, "jwt")
        let refresh = createJWT(req.jwt.sub, "refresh")
        res.cookie("secureCookie", JSON.stringify(jwt), {
            httpOnly: true,
            expires: dayjs().add(30, "days").toDate(),
        });
        next()
    }
    else
    {
        console.log(req.user)
        req.user ? next() : res.render('index')
    }
    
}

function verifyJWT(req, res, next)
{
    
    try
    {
        if(req.cookies.secureCookie)
        {
            let jwt = req.cookies.secureCookie
            let jsonNotationJWT = JSON.parse(jwt)
            let decrypted = jsonwebtoken.verify(jsonNotationJWT, 'secret')
            if(decrypted.exp < Date.now() / 1000)
            {
                
                res.render('index')
            }
            else
            {
                req.jwt = decrypted
                next()
            }
        }
    }
    catch(err)
    {
        res.render('index')
    }
    next()
}

let authenticationArray = [verifyJWT, isLoggedIn]

module.exports = authenticationArray