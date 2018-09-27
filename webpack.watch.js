const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'skatespot.io',
      template: 'client/helper/template.html',
    }),
    new BundleAnalyzerPlugin(),
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
      context: ['/**', '!/bundle.js', '!/index.html', '!/style.css'],
      target: 'http://localhost:3000',
    }],
    contentBase: '/assets/',
  },
};
