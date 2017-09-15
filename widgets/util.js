const makeClassName = () => {
  const classNameLength = 10
  const classNameSpace = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let className = ''
  Array(classNameLength).fill().map((_, i) => {
    className += classNameSpace.charAt(Math.floor(Math.random() * classNameSpace.length))
  })
  return className
}

const makeCssText = (className, cssObj) => {
  let cssText = ''
  cssText += `
    .${className} {
      ${cssObj.base || ''}
    }
  `

  if (cssObj.onHover) {
    cssText += `
      .${className}:hover {
        ${cssObj.onHover}
      }
    `
  }
  if (cssObj.onActive) {
    cssText += `
      .${className}:active {
        ${cssObj.onActive}
      }
    `
  }
  return cssText
}

export const miniStyled = elType => cssObj => {
  const className = makeClassName()
  let el = document.createElement(elType)
  el.className = className
  let cssText = makeCssText(className, cssObj)

  let style
  const styles = document.getElementsByTagName('style')
  Array.prototype.forEach.call(styles, (s) => {
    if (s.dataset.miniStyled) {
      style = s
    }
  })
  if (!style) {
    style = document.createElement('style')
    style.setAttribute('data-mini-styled', 'yes')
    document.getElementsByTagName('head')[0].appendChild(style);
  }
  if (style.styleSheet) {
    currentCss = s.styleSheet.cssText
    style.styleSheet.cssText = currentCss + cssText
  } else {
    style.appendChild(document.createTextNode(cssText))
  }
  return el
}
