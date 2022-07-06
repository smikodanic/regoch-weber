/**
 * Run $ npx webpack --config sys/webpack-sys.config.js
 * from the project's root folder.
 */
const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = {
  mode: 'production',
  entry: {
    'index': './sys/index.js',
    'index.min': './sys/index.js',
  },
  output: {
    path: path.resolve(__dirname, '_dist'),
    filename: '[name].js',
    clean: true // remove content of the directory defined in the output.path
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        include: /\.min\.js$/, // minify only index.min.js
        keepNames: true,  // keep function names https://esbuild.github.io/api/#keep-names
      }),
    ],
  },
};
