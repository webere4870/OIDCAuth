const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')

function createJWT(username)
{
    const payload = {
        username: username,
        expiration: Date.now() + parseInt('100')
    }
    let jwt = jsonwebtoken.sign(payload, 'secret')
    return jwt
}

async function verifyUser(passwordAttempt, salt,hash)
{
    let newHash = (await bcrypt.hash(passwordAttempt, salt)).toString()
    console.log(hash, newHash)
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