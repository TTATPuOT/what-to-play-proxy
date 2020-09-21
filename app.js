require("dotenv").config();
const express = require('express');
const cors = require("cors");
const getNewToken = require("./getNewToken");
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 8000;

app.use(cors());
app.use("/api", async (req, res, next) => {
    if (process.env.API_KEY_EXPIRES < +new Date()) await getNewToken();
    req.originalUrl = req.path;
    next();
}, createProxyMiddleware({
    changeOrigin: true,
    secure: false,
    target: 'https://api.igdb.com/v4/',
    headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Client-ID": process.env.CLIENT_ID
    }
}));
app.listen(port, () => {
    console.log(`Example app listening at port ${port}`)
})
