module.exports = {
  entry: {
    filename: './app.js',
  },
  output: {
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
  },
  experiments: {
    topLevelAwait: true
  },
};
