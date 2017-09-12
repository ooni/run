import React from 'react'

import { Provider, rebassTheme } from 'ooni-components'

const Layout = props => (
  <div>
    <Provider theme={rebassTheme}>
      <div className='content'>
        { props.children }
      </div>
    </Provider>
  </div>
)
export default Layout
