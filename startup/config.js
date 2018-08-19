/* Setup configurations */
const config = require('config'); // sets up environment variables

module.exports = function (app) {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: vidly_jwtPrivateKey is not defined');
    }

    app.set('view engine', 'pug'); // use pug for templating
    app.set('views', './views'); // default
}