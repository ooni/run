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
  let className = makeClassName()
  if (cssObj.className) {
    className = cssObj.className
  }

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

let cleanSlateCSS = `
    background-attachment:scroll !important;
    background-color:transparent !important;
    background-image:none !important;
    background-position:0 0 !important;
    background-repeat:repeat !important;
    border-color:black !important;
    border-color:currentColor !important;
    border-radius:0 !important;
    border-style:none !important;
    border-width:medium !important;
    bottom:auto !important;
    clear:none !important;
    clip:auto !important;
    color:inherit !important;
    counter-increment:none !important;
    counter-reset:none !important;
    cursor:auto !important;
    direction:inherit !important;
    display:inline !important;
    float:none !important;
    font-family: inherit !important;
    font-size: inherit !important;
    font-style:inherit !important;
    font-variant:normal !important;
    font-weight:inherit !important;
    height:auto !important;
    left:auto !important;
    letter-spacing:normal !important;
    line-height:inherit !important;
    list-style-type: inherit !important;
    list-style-position: outside !important;
    list-style-image: none !important;
    margin:0 !important;
    max-height:none !important;
    max-width:none !important;
    min-height:0 !important;
    min-width:0 !important;
    opacity:1;
    outline:invert none medium !important;
    overflow:visible !important;
    padding:0 !important;
    position:static !important;
    quotes: "" "" !important;
    right:auto !important;
    table-layout:auto !important;
    text-align:inherit !important;
    text-decoration:inherit !important;
    text-indent:0 !important;
    text-transform:none !important;
    top:auto !important;
    unicode-bidi:normal !important;
    vertical-align:baseline !important;
    visibility:inherit !important;
    white-space:normal !important;
    width:auto !important;
    word-spacing:normal !important;
    z-index:auto !important;

    /* CSS3 */
    /* Including all prefixes according to http://caniuse.com/ */
    /* CSS Animations don't cascade, so don't require resetting */
    -webkit-background-origin: padding-box !important;
            background-origin: padding-box !important;
    -webkit-background-clip: border-box !important;
            background-clip: border-box !important;
    -webkit-background-size: auto !important;
       -moz-background-size: auto !important;
            background-size: auto !important;
    -webkit-border-image: none !important;
       -moz-border-image: none !important;
         -o-border-image: none !important;
            border-image: none !important;
    -webkit-border-radius:0 !important;
       -moz-border-radius:0 !important;
            border-radius: 0 !important;
    -webkit-box-shadow: none !important;
            box-shadow: none !important;
    -webkit-box-sizing: content-box !important;
       -moz-box-sizing: content-box !important;
            box-sizing: content-box !important;
    -webkit-column-count: auto !important;
       -moz-column-count: auto !important;
            column-count: auto !important;
    -webkit-column-gap: normal !important;
       -moz-column-gap: normal !important;
            column-gap: normal !important;
    -webkit-column-rule: medium none black !important;
       -moz-column-rule: medium none black !important;
            column-rule: medium none black !important;
    -webkit-column-span: 1 !important;
       -moz-column-span: 1 !important; /* doesn't exist yet but probably will */
            column-span: 1 !important;
    -webkit-column-width: auto !important;
       -moz-column-width: auto !important;
            column-width: auto !important;
    font-feature-settings: normal !important;
    overflow-x: visible !important;
    overflow-y: visible !important;
    -webkit-hyphens: manual !important;
       -moz-hyphens: manual !important;
            hyphens: manual !important;
    -webkit-perspective: none !important;
       -moz-perspective: none !important;
        -ms-perspective: none !important;
         -o-perspective: none !important;
            perspective: none !important;
    -webkit-perspective-origin: 50% 50% !important;
       -moz-perspective-origin: 50% 50% !important;
        -ms-perspective-origin: 50% 50% !important;
         -o-perspective-origin: 50% 50% !important;
            perspective-origin: 50% 50% !important;
    -webkit-backface-visibility: visible !important;
       -moz-backface-visibility: visible !important;
        -ms-backface-visibility: visible !important;
         -o-backface-visibility: visible !important;
            backface-visibility: visible !important;
    text-shadow: none !important;
    -webkit-transition: all 0s ease 0s !important;
            transition: all 0s ease 0s !important;
    -webkit-transform: none !important;
       -moz-transform: none !important;
        -ms-transform: none !important;
         -o-transform: none !important;
            transform: none !important;
    -webkit-transform-origin: 50% 50% !important;
       -moz-transform-origin: 50% 50% !important;
        -ms-transform-origin: 50% 50% !important;
         -o-transform-origin: 50% 50% !important;
            transform-origin: 50% 50% !important;
    -webkit-transform-style: flat !important;
       -moz-transform-style: flat !important;
        -ms-transform-style: flat !important;
         -o-transform-style: flat !important;
            transform-style: flat !important;
    word-break: normal !important;
`

export const resetContainer = () => {
  return miniStyled('div')({
    base: cleanSlateCSS,
    className: makeClassName() + ' > *'
  })
}
