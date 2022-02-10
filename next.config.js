const webpack = require('webpack')

const withTM = require('next-transpile-modules')([
  '@formatjs/intl-relativetimeformat',
  '@formatjs/intl-utils',
  'react-intl',
  'intl-format-cache',
  'intl-messageformat-parser',
  'intl-messageformat',
])

module.exports = withTM({
  webpack: (config, options) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.\/lib\/update/
      })
    )

    config.module.rules.push({
      test: /\.(eot|ttf|woff|woff2|otf)$/,
      use: [
        {
          loader: 'url-loader'
        }
      ]
    })
    return config
  }
})
