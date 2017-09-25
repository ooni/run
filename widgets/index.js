const widgetBaseUrl = 'http://localhost:3000/widget'
// Stolen from: https://gist.github.com/dciccale/4087856
const DomReady = function(a,b,c){b=document,c='addEventListener';b[c]?b[c]('DOMContentLoaded',a):window.attachEvent('onload',a)}

const renderRunWidgets = () => {
  const buttonEls = document.getElementsByClassName('ooni-run-button')

  Array.prototype.forEach.call(buttonEls, (el) => {
    const { href, innerText } = el
    const iframe = document.createElement('iframe')
    iframe.setAttribute('src',
      widgetBaseUrl + '?link=' + encodeURIComponent(href) + '&type=button')
    iframe.setAttribute('width', '200');
    iframe.setAttribute('height', '60');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    el.parentNode.replaceChild(iframe, el)
  })

  const bannerEls = document.getElementsByClassName('ooni-run-banner')

  Array.prototype.forEach.call(bannerEls, (el) => {
    const { href, innerText } = el
    const iframe = document.createElement('iframe')
    iframe.setAttribute('src',
                        widgetBaseUrl +
                        '?link=' + encodeURIComponent(href) +
                        '&title=' + encodeURIComponent(innerText) +
                        '&type=banner')
    iframe.setAttribute('width', '400');
    iframe.setAttribute('height', '307');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    el.parentNode.replaceChild(iframe, el)
  })
}

DomReady(() => {
  renderRunWidgets()
})
