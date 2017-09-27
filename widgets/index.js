const widgetBaseUrl = 'https://run.ooni.io/widget'
// Stolen from: https://gist.github.com/dciccale/4087856
const DomReady = function(a,b,c){b=document,c='addEventListener';b[c]?b[c]('DOMContentLoaded',a):window.attachEvent('onload',a)}

const makeIframe = (w, h, src) => {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('src', src)
  iframe.setAttribute('width', w)
  iframe.setAttribute('height', h)
  iframe.setAttribute('frameborder', '0')
  iframe.setAttribute('scrolling', 'no')
  return iframe
}

const renderRunWidgets = () => {
  const buttonEls = document.getElementsByClassName('ooni-run-button')

  Array.prototype.forEach.call(buttonEls, (el) => {
    const { href, innerText } = el
    const iframe = makeIframe('200', '60', widgetBaseUrl + '?link=' +
      encodeURIComponent(href) + '&type=button')
    el.parentNode.replaceChild(iframe, el)
  })

  const bannerEls = document.getElementsByClassName('ooni-run-banner')

  Array.prototype.forEach.call(bannerEls, (el) => {
    const { dataset, innerText } = el
    const link = dataset.link || 'https://run.ooni.io'

    const iframe = makeIframe('400', '307', widgetBaseUrl +
                        '?link=' + encodeURIComponent(link) +
                        '&title=' + encodeURIComponent(innerText) +
                        '&type=banner')
    el.parentNode.replaceChild(iframe, el)
  })
}

document.readyState in {'loaded':1, 'interactive':1, 'complete':1} ? renderRunWidgets() : DomReady(() => { renderRunWidgets() })
