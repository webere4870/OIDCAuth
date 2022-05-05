function isLoggedIn(req, res, next)
{
    console.log(req.session)
    req.user ? next() : res.status(401).send("<h1> 401 Unauthorized. Not found</h1>")
}

module.exports = isLoggedIn