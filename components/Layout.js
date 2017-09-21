import React from 'react'

import { Provider, theme } from 'ooni-components'

const Layout = props => (
  <div>
    <Provider theme={theme}>
      <div className='content'>
        { props.children }
      </div>
    </Provider>
  </div>
)
export default Layout
