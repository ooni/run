import React from 'react'

import { Button, Link } from 'ooni-components'
import Layout from '../components/Layout'

export const OONIRunWidget = (props) => {
  return (
    <Layout>
      <Link href={props.href}>
        <Button>{props.text}</Button>
      </Link>
    </Layout>
  )
}

export default OONIRunWidget
