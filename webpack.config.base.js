var path = require("path");
var webpack = require('webpack');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// 引入样式抽离插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: __dirname,

  entry: {
    // Add as many entry points as you have container-react-components here
    app: './html/app.js'
  },

  output: {
      path: path.resolve('./html/static/bundles/local/'),
      filename: "[name]-[hash].js",
      publicPath: '/static/bundles/prod/'
  },

  externals: [
  ], // add all vendor libs

  plugins: [
    // new BundleAnalyzerPlugin({ analyzerPort: 8919 }),
    // new webpack.optimize.CommonsChunkPlugin({name:'vendors', filename:'vendors.js'}),
    new webpack.LoaderOptionsPlugin({  
      options: {  
          postcss: function(){  
            return [  
                require("autoprefixer")({  
                    browsers: ['ie>=8','>1% in CN']  
                })  
            ]  
          }  
        }  
    }),
    new MiniCssExtractPlugin({ //样式文件单独打包
      filename: "app.css",
      disable: false,
      allChunks: true
    }),

  //解决moment打包的时候把所有的语言都打包进去的问题
  new webpack.ContextReplacementPlugin(
    /moment[\\\/]locale$/,
    /^\.\/(zh-cn)$/
    ),
    
  ], // add all common plugins here

  module: {
    rules:[
      {
        test: /\/expression\/parser\.js$/, 
        use: 'exports-loader?parser'
      },
      {
        test: /\.css$/,
        use: ['css-hot-loader',
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    // only enable hot in development
                    hmr: process.env.NODE_ENV==='development',
                    // if hmr does not work, this is a forceful method.
                    reloadAll: true,
                },
            },
            { loader: 'css-loader', options: { sourceMap: true, minimize: process.env.NODE_ENV==='production' } }, // translates CSS into CommonJS
            { loader: 'postcss-loader', options: { sourceMap: true } }, // autoprefix and minify css
        ]
      },
      {
          test: /\.less$/i,
          use: ['css-hot-loader',
              {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                      // only enable hot in development
                      hmr: process.env.NODE_ENV==='development',
                      // if hmr does not work, this is a forceful method.
                      reloadAll: true,
                  },
              },
              { loader: 'css-loader', options: { sourceMap: true, minimize: process.env.NODE_ENV==='production' } }, // translates CSS into CommonJS
              { loader: 'less-loader', options: { sourceMap: true, javascriptEnabled: true } } // compiles Less to CSS
          ]
      },
      {
        test: /\.html$/, 
        use: 'raw-loader'
      },
      {
        test: /\.(gif|png|jpg)$/, 
        use: 'url-loader?limit=8192'
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/, 
        use: 'url-loader?limit=81920'
      },
      { 
        test: /\.jsx?$/, 
        exclude: /node_modules/, 
        use: ['babel-loader'] 
      }, 
    ] // add all common loaders here
  },

  resolve: {
    modules:['node_modules', 'bower_components'],
    extensions: ['.js', '.jsx', '.css']
  }
};
