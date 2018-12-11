const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack');
const fs = require('fs');

module.exports = {
  plugins: [
    new CleanWebpackPlugin('./dist'),
    new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        API_URL: JSON.stringify('https://walltherapy-strapi.herokuapp.com'),
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
      inline: fs.readFileSync('client/helper/serviceWorkerBody.js', 'utf8'),
    }),
    new GenerateSW(),
    new CopyWebpackPlugin([
      {
        from: `${__dirname}/static`,
      },
    ]),
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
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css'],
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'bundle.[contenthash].js',
  },
  devServer: {
    publicPath: '/',
    contentBase: '/',
  },
};
