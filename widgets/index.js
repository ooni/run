import React from 'react'
import ReactDom from 'react-dom'

import OONIRunWidget from './OONIRunWidget'

const renderRunWidgets = () => {
  const runEls = document.getElementsByClassName('ooni-run-button')

  Array.prototype.forEach.call(runEls, (el) => {
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
