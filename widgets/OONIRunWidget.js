import React from 'react'

import { Button, Link } from 'ooni-components'

export const OONIRunWidget = (props) => {
  return (
    <Link href={props.href}>
      <Button>{props.text}</Button>
    </Link>
  )
}

export default OONIRunWidget
