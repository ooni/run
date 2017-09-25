const webpack = require('webpack')

module.exports = {
  webpack: (config) => {
    // This is used to mock the dependencies of useragent for the browser
    config.node = {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    }

    config.plugins.push(
      new webpack.IgnorePlugin(/\.\/lib\/update/)
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
}
