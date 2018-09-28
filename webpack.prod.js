const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new CleanWebpackPlugin('./dist'),
    new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      title: 'skatespot.io',
      template: 'client/helper/template.html',
    }),
    new GenerateSW(),
  ],
  entry: [
    './client/app/App.jsx',
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css'],
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/app/',
    filename: 'bundle.[contenthash].js',
  },
  devServer: {
    publicPath: '/app/',
    proxy: [{
      context: ['/**', '!/bundle.js'],
      target: 'http://localhost:3000',
    }],
    contentBase: '/app/',
  },
};
