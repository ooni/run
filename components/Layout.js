import React from 'react'

import {
  Provider
} from 'rebass'

import rebassConfig from '../themes/rebassConfig'

const Layout = props => (
  <div>
    <Provider theme={rebassConfig}>
      <div className='content'>
        { props.children }
      </div>
    </Provider>
  </div>
)
export default Layout
