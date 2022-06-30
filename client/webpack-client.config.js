/**
 * Run $ npx webpack --config sys/webpack-sys.config.js
 * from the project's root folder.
 */
const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = {
  mode: 'production',
  entry: './client/app.js',
  output: {
    path: path.resolve(__dirname), // /web/node/regoch/regoch-weber/client
    filename: 'app.min.js',
  },

  devtool: 'source-map',
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        keepNames: true,
      }),
    ],
  },

  watch: true,
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
    ignored: ['node_modules']
  }
};
