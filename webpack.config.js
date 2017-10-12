const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// console.log('\x1Bc');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    app: './index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './public/assets'),
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: { presets: ['es2015'] },
      }],
    }, {
      test: /\.css$/,
      // use: ['style-loader', 'css-loader'],
      loader: ExtractTextPlugin.extract('style', 'css!sass'),
    }, {
      test: /\.(sass|scss)$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader', 'sass-loader'],
      }),
    }, {
      test: /\.hbs$/,
      loader: 'handlebars-loader',
    },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].bundle.css',
      allChunks: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
    }),
  ],
};
