
module.exports = loggedIn = async(req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'first login the website!')
        return res.redirect('/login')
    }
    next()
}

module.exports.saveUrl =async (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

