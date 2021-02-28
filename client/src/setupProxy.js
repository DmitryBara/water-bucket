
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config({path:'.env'})
const BACKEND_SERVER = process.env.BACKEND_SERVER


module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: BACKEND_SERVER,
      changeOrigin: true,
    })
  );
};