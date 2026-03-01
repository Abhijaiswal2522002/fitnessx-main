import path from 'path';
import nodeExternals from 'webpack-node-externals';

export default {
  target: 'node',                // build for Node.js environment
  entry: './index.js',           // Path to your entry file
  externals: [nodeExternals()],  // don't bundle dependencies in node_modules
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
    // no browser fallbacks needed for a node target
  },
};
