import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    }
    catch (err) {
      console.log(err)
      throw err
    } finally {
      sheet.seal()
    }
  }

  render () {
    return (
      <Html>
        <Head>
          {this.props.styleTags}
        </Head>
        <body>
          <div className='root'>
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    )
  }
}
