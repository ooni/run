/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const webpack = require('webpack')
const glob = require('glob')
const { basename } = require('node:path')

const LANG_DIR = './public/static/lang/'
const DEFAULT_LOCALE = 'en'

function getSupportedLanguages() {
  const supportedLanguages = new Set()
  supportedLanguages.add(DEFAULT_LOCALE) // at least 1 supported language
  // biome-ignore lint/complexity/noForEach: <explanation>
  glob
    .sync(`${LANG_DIR}/**/*.json`)
    .forEach((f) => supportedLanguages.add(basename(f, '.json')))
  return [...supportedLanguages]
}

module.exports = withBundleAnalyzer(
  withSentryConfig(
    {
      output: 'standalone',
      reactStrictMode: true,
      swcMinify: true,
      i18n: {
        locales: getSupportedLanguages(),
        defaultLocale: DEFAULT_LOCALE,
      },
      async rewrites() {
        return [
          {
            source: '/apple-app-site-association',
            destination: '/api/apple-app-site-association',
          },
          {
            source: '/.well-known/assetlinks.json',
            destination: '/api/assetlinks',
          },
          {
            source: '/api/v2/:path*',
            destination: `${process.env.NEXT_PUBLIC_OONI_API}/api/v2/:path*`,
          },
        ]
      },
      webpack: (config, options) => {
        config.plugins.push(
          new options.webpack.DefinePlugin({
            'process.env.DEFAULT_LOCALE': DEFAULT_LOCALE,
            'process.env.LOCALES': JSON.stringify(getSupportedLanguages()),
          }),
        )

        config.plugins.push(
          new webpack.IgnorePlugin({
            resourceRegExp: /\.\/lib\/update/,
          }),
        )

        // Grab the existing rule that handles SVG imports
        const fileLoaderRule = config.module.rules.find((rule) =>
          rule.test?.test?.('.svg'),
        )

        config.module.rules.push(
          // Convert all *.svg imports to React components
          {
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
          },
        )

        // Modify the file loader rule to ignore *.svg, since we have it handled
        fileLoaderRule.exclude = /\.svg$/i

        return config
      },
    },
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options
      org: 'ooni',
      project: 'run',
      sentryUrl: 'https://sentry.io/',

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      // tunnelRoute: "/monitoring",

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
    },
  ),
)
