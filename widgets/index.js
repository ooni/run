import OONIRunWidget from './OONIRunWidget'

const renderRunWidgets = () => {
  const runEls = document.getElementsByClassName('ooni-run-button')

  Array.prototype.forEach.call(runEls, (el) => {
    const buttonContainer = document.createElement('div')
    const { href, innerText } = el
    el.parentNode.insertBefore(buttonContainer, el.nextSibling)
    el.parentNode.removeChild(el)

    buttonContainer.appendChild(
      OONIRunWidget({href, text: innerText})
    )
  })
}

renderRunWidgets()
