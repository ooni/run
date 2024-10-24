import { useState } from 'react'
import { MdOutlineCheckCircle, MdOutlineContentCopy } from 'react-icons/md'

type Code = {
  text: string
}

const Code = ({ text }: Code) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyTextToClipboard = async (text: string) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    }
    return document.execCommand('copy', true, text)
  }

  const handleCopyClick = () => {
    copyTextToClipboard(text)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="flex text-sm p-4 bg-blue-100 whitespace-pre-wrap items-center font-mono">
      {text}
      <div className="ml-2 cursor-pointer">
        {isCopied ? (
          <MdOutlineCheckCircle className="text-green-700" size="24" />
        ) : (
          <MdOutlineContentCopy onClick={handleCopyClick} size="24" />
        )}
      </div>
    </div>
  )
}

export default Code
