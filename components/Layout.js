import React from 'react'

import Head from 'next/head'
import meta from '../config/meta'

const Layout = props => (
  <>
    <Head>
      <title>{props.title || meta.defaultTitle}</title>
      <meta httpEquiv='Content-Type' content={meta.contentType} />
      <meta name='viewport' content={meta.viewport} />
    </Head>
     <div className='content'>
        { props.children }
      </div>
  </>
)
export default Layout
