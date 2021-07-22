const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 删除文件
// 引入优化/压缩CSS的插件
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// This plugin uses uglify-js to minify your JavaScript.
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var config = require('./webpack.config.base.js');

config.output.path = require('path').resolve('./html/static/bundles/prod/');
config.optimization.minimizer =  [
    new UglifyJsPlugin({
        uglifyOptions: {
            compress: {
                drop_console: true
            },
        },
    }),
    new OptimizeCssAssetsPlugin({})
]

config.plugins = config.plugins.concat([
  new CleanWebpackPlugin(),   //删除文件夹
  new BundleTracker({
    filename: './webpack-stats-prod.json'
  }),
  //webpack2的UglifyJsPlugin不再压缩loaders，通过以下设置来压缩loaders
  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
  // minifies your code
  // new webpack.optimize.UglifyJsPlugin({
  //   compressor: {
  //     warnings: false,
  //     drop_console:true,  // delete all console log
  //   },
  //   output: {
  //     comments: false, //关闭注释
  //   },
  // })
]);
module.exports = config;