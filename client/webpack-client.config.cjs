/**
 * Run $ npx webpack --config client/webpack-client.config.js
 * from the project's root folder.
 */
const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = {
  mode: 'production',
  entry: {
    'app': './client/app.js',
    'app.min': './client/app.js'
  },
  output: {
    path: path.resolve(__dirname, '_dist'), // /web/node/regoch/regoch-weber/client
    filename: '[name].js',
    clean: true // remove content of the directory defined in the output.path
  },

  devtool: 'source-map',
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        include: /\.min\.js$/, // minify only app.min.js
        keepNames: true, // keep function names https://esbuild.github.io/api/#keep-names
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
