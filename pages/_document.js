import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render () {
    return (
      <html>
        <Head />
        <body>
          <div className='root'>
            <Main />
          </div>
          <NextScript />
        </body>
      </html>
    )
  }
}
