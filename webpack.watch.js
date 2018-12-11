const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'skatespot.io',
      template: 'client/helper/template.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify('http://localhost:1337'),
      },
    }),
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
        use: ['style-loader', 'css-loader'],
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
    filename: 'bundle.js',
  },
  devServer: {
    publicPath: '/',
    historyApiFallback: { index: '/' },
    contentBase: '/',
  },
};
