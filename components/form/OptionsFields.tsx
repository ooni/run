import { useFieldArray, Controller, useFormContext } from 'react-hook-form'
import { Flex, Box, Input, Button } from 'ooni-components'
import { FaRegTrashCan } from 'react-icons/fa6'
import { FieldsPropTypes } from './TestListForm'
import styled from 'styled-components'

const StyledLabel = styled.div`
label {
  font-size: 12px;
}
`

const OptionsFields = ({ name }: FieldsPropTypes) => {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
    <>
      {fields.map((item, index) => (
        <Box key={item.id} mt={3}>
          <Flex>
            <Box width={[1, 4 / 12]} mr={[0, 2]}>
              <Controller
                key={`${name}[${index}]-${item.id}-key`}
                render={({ field }) => (
                  <StyledLabel>
                    <Input {...field} label="Key" />
                  </StyledLabel>
                )}
                name={`${name}[${index}].key`}
                control={control}
              />
            </Box>
            <Flex width={[1, 8 / 12]} alignItems='end'>
              <Box width={1}>
                <Controller
                  key={`${name}[${index}]-${item.id}-value`}
                  render={({ field }) => (
                    <StyledLabel>
                      <Input {...field} label="Value" />
                    </StyledLabel>
                  )}
                  name={`${name}[${index}].value`}
                  control={control}
                />
              </Box>
              <Button
                mb={12}
                ml={2}
                variant="iconButton"
                onClick={() => remove(index)}
              >
                <FaRegTrashCan size={20} />
              </Button>
            </Flex>
          </Flex>
        </Box>
      ))}
      <Button
        mt={2}
        variant="link"
        type="button"
        onClick={() => {
          append({ key: '', value: '' })
        }}
      >
        + Add option
      </Button>
    </>
  )
}

export default OptionsFields
