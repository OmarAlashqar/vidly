
/* Middleware should be used after all routes are defined */

module.exports = function (err, req, res, next) {
    res.send(500).send('something went wrong.')
}