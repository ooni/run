import { Box, Flex, theme } from "ooni-components"
import { useState } from "react"
import { MdOutlineCheckCircle, MdOutlineContentCopy } from "react-icons/md"
import { styled } from "styled-components"

const StyledCode = styled(Flex)`
font-size: 14px;
font-family: courier, monospace;
white-space: pre-wrap;
`

const StyledIcon = styled(Box)`
cursor: pointer;
`

type Code = {
	text: string
}

const Code = ({ text }: Code) => {
	const [isCopied, setIsCopied] = useState(false)

	const copyTextToClipboard = async (text: string) => {
		if ("clipboard" in navigator) {
			return await navigator.clipboard.writeText(text)
		}
		return document.execCommand("copy", true, text)
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
		<StyledCode p={3} bg="blue1">
			{text}
			<StyledIcon ml={2}>
				{isCopied ? (
					<MdOutlineCheckCircle color={theme.colors.green7} />
				) : (
					<MdOutlineContentCopy onClick={handleCopyClick} />
				)}
			</StyledIcon>
		</StyledCode>
	)
}

export default Code
