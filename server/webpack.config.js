import path from 'path';

export default {
  entry: './index.js',  // Path to your entry file
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Use Babel to transpile ES6+ code
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    fallback: {
        fs: false
      }
  },
};
