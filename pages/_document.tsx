import Document, { Head, Html, Main, NextScript } from 'next/document'
import { getDirection } from './_app'

export default class MyDocument extends Document {
  render = () => (
    <Html
      dir={getDirection(this.props.locale as string)}
      lang={this.props.locale}
    >
      <Head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="2127f76c-e852-43d9-b40c-dcceca8907e7"
          data-domains="run.ooni.org"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
