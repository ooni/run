import React from 'react'

import Head from 'next/head'
import { Provider, theme } from 'ooni-components'

import meta from '../config/meta'

const Layout = props => (
  <div>
    <Head>
      <title>{props.title || meta.defaultTitle}</title>
      <meta httpEquiv='Content-Type' content={meta.contentType} />
      <meta name='viewport' content={meta.viewport} />
    </Head>
    <Provider theme={theme}>
      <div className='content'>
        { props.children }
      </div>
    </Provider>
  </div>
)
export default Layout
