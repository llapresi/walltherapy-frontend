module.exports = {
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
    path: `${__dirname}/hosted`,
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
  devServer: {
    publicPath: '/assets/',
    proxy: [{
      context: ['/**', '!/assets/bundle.js'],
      target: 'http://localhost:3000',
    }],
    contentBase: '/assets/',
  },
};
