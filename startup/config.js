/* Setup configurations */

module.exports = function (app) {
    const expectToBeSet = [
        'MONGO_URI',
        'JWT_SECRET',
    ];

    expectToBeSet.forEach(v => {
        if (!process.env[v]) {
            throw new Error(`FATAL: ${v} environment variable is not set.`);
        }
    });

    if (process.env.NODE_ENV === 'test' && !process.env.MONGO_TEST_URI) {
        throw new Error(`FATAL: ${v} environment variable is not set.`);
    }

    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
    if (!process.env.PORT) process.env.PORT = 3000;

    app.set('view engine', 'pug'); // use pug for templating
    app.set('views', './views'); // default
}