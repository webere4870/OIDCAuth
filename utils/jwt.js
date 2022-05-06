const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

function createJWT(username, jwtType)
{
    let expire = 0;
    if(jwtType=="refresh")
    {
        expire = 60 * 60 * 24
    }
    else
    {
        expire = 60 * 60
    }

    const payload = {
        sub: username,
        expiresIn: Date.now() +  expire
    }
    let jwt = jsonwebtoken.sign(payload, "secret", 
    {expiresIn: jwtType == "refresh" ? "1d": "180s"})
    return jwt
}

async function verifyUser(passwordAttempt, salt,hash)
{
    let newHash = (await bcrypt.hash(passwordAttempt, salt)).toString()
    if(newHash == hash)
    {
        return true;
    }
    else
    {
        return false;
    }
}


async function createUser(username, password)
{
    let salt = (await bcrypt.genSalt(10)).toString()
    let hash = (await bcrypt.hash(password, salt)).toString()
    return {username: username, salt: salt, hash: hash}
}


module.exports = {createJWT, createUser, verifyUser}