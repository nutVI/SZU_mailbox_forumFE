const path = require('path');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.VUE_APP_ENVIRONMENT': JSON.stringify("production"),
      'process.env.VUE_APP_Url': JSON.stringify("https://mailbox.nutvii.top/"),
    }),
  ],
  externals: {
    vue: 'Vue'
  },
  mode: "production"
}