import React from 'react'
import ReactDom from 'react-dom'

import OONIRunWidget from './OONIRunWidget'

const renderRunWidgets = () => {
  document.getElementsByClassName('ooni-run-button').map((el) => {
    ReactDom.render(
      React.cloneElement(OONIRunWidget, {
        href: el.href,
        text: el.innerText
      }),
      el
    )
  })
}

renderRunWidgets()
