const { createProxyMiddleware } = require('http-proxy-middleware');

const BackEndURL = "http://localhost:3001"
// const BackEndURL = "https://back-e-e.herokuapp.com"

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: BackEndURL,
            changeOrigin: true,
        })
    );
    app.use(
        '/--/api',
        createProxyMiddleware({
            target: "https://exp.host",
            changeOrigin: true,
        })
    );
};