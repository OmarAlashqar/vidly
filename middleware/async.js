
/* Router handler factory for wrapping error handling */
/* DEPRECATED: app uses express-async-errors to monkey patch error handling */

module.exports = function(handler) {
    return async function(res, req, next) {
        try {
            handler(res, req);
        } catch (ex) {
            next(ex);
        }
    };
}