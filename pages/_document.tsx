import Document, { Head, Html, Main, NextScript } from 'next/document'
import { getDirection } from './_app'

export default class MyDocument extends Document {
  render = () => (
    <Html dir={getDirection(this.props.locale)} lang={this.props.locale}>
      <Head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="dbcccbba-4a4e-4a6a-a026-c2ea17e14117"
          data-domains="run.ooni.io,run.ooni.org"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
