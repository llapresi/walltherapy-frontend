const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'skatespot.io',
      template: 'client/helper/template.html',
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
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css'],
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/app',
    filename: 'bundle.js',
  },
  devServer: {
    publicPath: '/app',
    proxy: [{
      context: ['/**', '!/app', '!/app/**'],
      target: 'http://localhost:1337',
    }],
    historyApiFallback: { index: '/app' },
    contentBase: '/app/',
  },
};
