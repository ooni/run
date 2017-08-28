import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

const Document = props => {
  const sheet = new ServerStyleSheet()
  const main = sheet.collectStyles(props.main)
  /* XXX
   * This is a hack to workaround what I believe is a bug with
   * styled-components SSR
   * If you comment out this line I get back an empty stylesheet
   * */
  renderToString(main)
  const styleTags = sheet.getStyleElement()
  return (
    <html>
    <head>
      <title>{props.title}</title>
      {styleTags}
    </head>
    <body>
      {main}
    </body>
    </html>
  )
}
export default Document
