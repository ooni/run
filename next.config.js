/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')

const { DEFAULT_LOCALE, SUPPORTED_LANGUAGES } = require('./lib/i18n')

module.exports = withSentryConfig(
  {
    output: 'standalone',
    reactStrictMode: true,
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    i18n: {
      locales: SUPPORTED_LANGUAGES,
      defaultLocale: DEFAULT_LOCALE,
    },
    async headers() {
      const headers = []
      if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
        headers.push({
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex',
            },
          ],
          source: '/:path*',
        })
      }
      return headers
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
  },
  {
    org: 'ooni',
    project: 'run',
    sentryUrl: 'https://sentry.io/',

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
    widenClientFileUpload: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // tunnelRoute: "/monitoring",

    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  },
)
