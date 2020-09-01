require("dotenv").config();
const express = require('express');
const cors = require("cors");
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 8000;

app.use(cors());
app.use("/api", (req, res, next) => {
    req.originalUrl = req.path
    next()
}, createProxyMiddleware({
    changeOrigin: true,
    secure: false,
    target: 'https://api-v3.igdb.com',
    prependPath: false,
    onProxyReq: proxyReq => {
        proxyReq.setHeader('user-key', process.env.APIKEY);
    }
}));
app.listen(port, () => {
    console.log(`Example app listening at port ${port}`)
})
