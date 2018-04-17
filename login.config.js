module.exports = {
  entry: [
    './client/login/client.js',
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: `${__dirname}/hosted`,
    publicPath: '/',
    filename: 'loginBundle.js',
  },
  devServer: {
    contentBase: './dist',
  },
};
