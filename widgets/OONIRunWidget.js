import { miniStyled, resetContainer } from './util'

const colors = {
  base: "#0588cb",
  white: "#fff",
  blue4: "#0daaf9",
  blue6: "#057db9",
}

const buttonStyle = {base: `
  border: none;
  border-radius: 2px;
  display: inline-block;
  height: 36px;
  line-height: 36px;
  padding: 0 36px;
  vertical-align: middle;
  -webkit-tap-highlight-color: transparent;

  outline: 0;

  font-family: "Fira Sans";
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  color: ${colors.white};
  background-color: ${colors.base};

  text-align: center;
  letter-spacing: .5px;
  z-index: 1;
  transition: .2s ease-out;
  cursor: pointer;
`,
  'onHover': `
    background-color: ${colors.blue4};
  `,
  'onActive': `
    transition: .2s ease-in;
    background-color: ${colors.blue6};
  `
}

export const OONIRunWidget = (props) => {
  const container = resetContainer()

  let a = miniStyled('a')``
  a.href = props.href
  container.appendChild(a)

  let button = miniStyled('button')(buttonStyle)
  button.appendChild(document.createTextNode(props.text))

  a.appendChild(button)
  return container
}

export default OONIRunWidget
