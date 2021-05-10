const { createProxyMiddleware } = require('http-proxy-middleware');
// const BackEndURL ="https://api-benhvien.herokuapp.com"
const BackEndURL = "http://localhost:3001"
//  const BackEndURL ="http://backend:3001"

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