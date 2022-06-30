/**
 * Run $ npx webpack --config sys/webpack-sys.config.js
 * from the project's root folder.
 */
const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = {
  mode: 'production',
  entry: './sys/index.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'index.min.js',
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        keepNames: true,
      }),
    ],
  },
};
