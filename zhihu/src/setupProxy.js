const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        createProxyMiddleware("/api", {
            target: "http://127.0.0.1:7100",
            changeOrigin: true,
            ws: true,
            pathRewrite: { "^/api": "" }
        }),
        // createProxyMiddleware("/comments", {
        //     target: "https://news-at.zhihu.com/api/4/",
        //     changeOrigin: true,
        //     ws: true,
        //     //pathRewrite: { "^/api": "" }
        // })

        //https://news-at.zhihu.com/api/4/story/${id}/short-comments
        //https://news-at.zhihu.com/api/4/story/9768864/short-comments  
    );
};