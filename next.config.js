/** @type {import('next').NextConfig} */

const webpack = require("webpack")
const glob = require("glob")
const { basename } = require("path")

const LANG_DIR = "./public/static/lang/"
const DEFAULT_LOCALE = "en"

function getSupportedLanguages() {
  const supportedLanguages = new Set()
  supportedLanguages.add(DEFAULT_LOCALE) // at least 1 supported language
  // biome-ignore lint/complexity/noForEach: <explanation>
  glob
    .sync(`${LANG_DIR}/**/*.json`)
    .forEach((f) => supportedLanguages.add(basename(f, ".json")))
  return [...supportedLanguages]
}

module.exports = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: getSupportedLanguages(),
    defaultLocale: DEFAULT_LOCALE,
  },
  async rewrites() {
    return [
      {
        source: "/apple-app-site-association",
        destination: "/api/apple-app-site-association",
      },
      {
        source: "/.well-known/assetlinks.json",
        destination: "/api/assetlinks",
      },
    ]
  },
  compiler: {
    // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
    styledComponents: {
      ssr: true,
    },
  },
  webpack: (config, options) => {
    config.plugins.push(
      new options.webpack.DefinePlugin({
        "process.env.DEFAULT_LOCALE": DEFAULT_LOCALE,
        "process.env.LOCALES": JSON.stringify(getSupportedLanguages()),
      }),
    )

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.\/lib\/update/,
      }),
    )

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    )

    config.module.rules.push(
      // Convert all *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}
