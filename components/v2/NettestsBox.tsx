import { Box, Flex, Heading, Text } from "ooni-components"
import { cloneElement, ReactElement } from "react"
import { testGroups, testNames } from 'utils/test-info'

type NettestsBoxProps = {
  nettests: Nettest[]
}

const NettestsBox = ({ nettests } : NettestsBoxProps ) => {
  const getIconComponent = (icon: ReactElement | undefined) => (
    icon ? cloneElement(icon, {size: '20'}) : null
  )

  return (
    <Box p={3} mt={3} sx={{border: '1px solid', borderColor: 'gray3', borderRadius: 8}}>
      <Heading h={4} my={0}>Tests</Heading>
      {nettests.map((nettest, i) => (
        <Flex key={`${nettest.test_name}-${i}`} flexDirection='column' pb={2} pt={2} sx={i > 0 ? {borderTop: '1px solid', borderColor: 'gray3'} : {}}>
          <Flex alignItems="center">
            <Box color={testGroups[testNames[nettest.test_name].group].color} mr={2}>
              {getIconComponent(testGroups[testNames[nettest.test_name].group].icon)}
            </Box>
            <Text fontWeight={600}>{testNames[nettest.test_name].name}</Text>
          </Flex>
          {!!nettest.inputs?.length && (
            <>
              <Text fontSize={0} fontWeight={600} mt={2} mb={2}>INPUTS ({nettest.inputs.length})</Text>
              <Text fontSize={14}>
                {nettest.inputs.join(', ')}
              </Text>
            </>
          )}
        </Flex>
      ))}
    </Box>
  )
}

export default NettestsBox