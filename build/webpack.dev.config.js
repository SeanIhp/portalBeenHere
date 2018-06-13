const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');

fs.open('./src/config/env.js', 'w', function (err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) { });
});

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            filename: 'vendors.js'
        }),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './src/template/index.ejs',
            inject: false
        })
    ],
    // 本地调试网络请求跨域代理配置
    devServer: {
        // host: "www.cloud360.com.cn",
        proxy: {
            '/ampAuthService/*': {
                target: 'http://172.17.13.80/amp-auth-service/rest',
                changeOrigin: true,
                secure: false, // 接受 运行在 https 上的服务
                pathRewrite: { '^/ampAuthService': '' }
            },
            '/ampOpenapiService/*': {
                target: 'http://172.17.13.80/amp-openapi-service/rest',
                changeOrigin: true,
                secure: false, // 接受 运行在 https 上的服务
                pathRewrite: { '^/ampOpenapiService': '' }
            },
            '/portalMsgService/*': {
                target: 'http://172.17.13.9:8080/rest',
                changeOrigin: true,
                secure: false, // 接受 运行在 https 上的服务
                pathRewrite: { '^/portalMsgService': '' }
            },
            '/bh/*': { 
                target: 'http://localhost:10080/core/',
                changeOrigin: true,
                secure: false, // 接受 运行在 https 上的服务
                pathRewrite: { '^/bh': '' }
            }
        }
    }
});