function isLoggedIn(req, res, next)
{
    (req.user || req.cookies.secureCookie) ? next() : res.render('index')
}

module.exports = isLoggedIn