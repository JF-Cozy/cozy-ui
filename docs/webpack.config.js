const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const { isUsingDevStyleguidist } = require('./build-utils')

module.exports = {
  resolve: {
    alias: {
      docs: __dirname
    },
    extensions: ['.jsx', '.js', '.json', '.styl']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.styl$/,
        loader: [
          // While developing on the styleguidist, we do not want the CSS
          // to be extract otherwise CSS hot reload does not work
          isUsingDevStyleguidist()
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'stylus-loader',
            options: {
              use: [require('../stylus')()]
            }
          }
        ]
      },
      {
        test: /\.(png|gif|jpe?g|svg|pdf)$/i,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    isUsingDevStyleguidist() ? null : new MiniCssExtractPlugin('[name].css'),
    new webpack.DefinePlugin({
      'process.env': {
        USE_REACT: 'true'
      }
    })
  ].filter(Boolean)
}
