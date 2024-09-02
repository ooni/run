import { Box, Flex, Heading, Text } from "ooni-components"
import { cloneElement, useState, type ReactElement } from "react"
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { useIntl } from "react-intl"
import { testGroups, testNames } from "utils/test-info"

type NettestsInputsProps = {
  inputs: string[]
}

const NettestsInputs = ({ inputs }: NettestsInputsProps) => {
  const intl = useIntl()
  const [collapsed, setCollapsed] = useState(false)
  return (
    <>
      <Text
        fontSize={0}
        fontWeight={600}
        mt={2}
        mb={2}
        onClick={() => setCollapsed(!collapsed)}
      >
        {intl.formatMessage({ id: "TestListForm.NettestFields.Urls" })} ({inputs.length}){" "}
        <Box as="span" ml={3}>
          {collapsed ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
        </Box>
      </Text>
      <Text
        fontSize={14}
        sx={{
          ...(!collapsed && {
            textOverflow: "ellipsis",
            height: "20px",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }),
        }}
      >
        {inputs.join(", ")}
      </Text>
    </>
  )
}

type NettestsBoxProps = {
  nettests: Nettest[]
}

const NettestsBox = ({ nettests }: NettestsBoxProps) => {
  const intl = useIntl()
  const getIconComponent = (icon: ReactElement | undefined) =>
    icon ? cloneElement(icon, { size: "20" }) : null

  return (
    <Box
      p={3}
      sx={{ border: "1px solid", borderColor: "gray3", borderRadius: 8 }}
    >
      <Heading h={4} my={0}>
        {intl.formatMessage({ id: "TestListForm.AdminNettests.Tests" })}
      </Heading>
      {nettests.map((nettest, i) => (
        <Flex
          key={`${nettest.test_name}-${i}`}
          flexDirection="column"
          pb={2}
          pt={2}
          sx={i > 0 ? { borderTop: "1px solid", borderColor: "gray3" } : {}}
        >
          <Flex alignItems="center">
            {testNames[nettest.test_name]?.group && (
              <Box
                color={testGroups[testNames[nettest.test_name].group].color}
                mr={2}
              >
                {getIconComponent(
                  testGroups[testNames[nettest.test_name].group].icon,
                )}
              </Box>
            )}
            {testNames[nettest.test_name]?.name ? (
              <Text fontWeight={600}>{testNames[nettest.test_name].name}</Text>
            ) : (
              <Text fontWeight={600}>{nettest.test_name}</Text>
            )}
          </Flex>
          {!!nettest.inputs?.length && (
            <NettestsInputs inputs={nettest.inputs} />
          )}
        </Flex>
      ))}
    </Box>
  )
}

export default NettestsBox
