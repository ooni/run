import { styled } from "styled-components"
import { MdOutlineContentCopy, MdOutlineCheckCircle } from 'react-icons/md'
import { Flex, Box, theme } from "ooni-components"
import { useState } from "react"


const StyledCode = styled(Flex)`
  font-family: courier, monospace;
  padding: 14px;
  white-space: pre-wrap;
`

const StyledIcon = styled.span`
`

type Code = {
  text: string
}

const Code = ({ text }: Code) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyTextToClipboard = async (text: string) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  return (
    <StyledCode bg='gray2'>
      {text} 
      <Box ml={2}>
        {isCopied ? 
          <MdOutlineCheckCircle color={theme.colors.green7} /> :
          <MdOutlineContentCopy onClick={handleCopyClick} />
        }
      </Box>
    </StyledCode>
  )
}

export default Code