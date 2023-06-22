import { useFieldArray, Controller, useFormContext } from 'react-hook-form'
import { Flex, Box, Input, Button } from 'ooni-components'
import { MdDelete } from 'react-icons/md'
import { FieldsPropTypes } from './TestListForm'

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
                  <Input {...field} label="Key" placeholder="" />
                )}
                name={`${name}[${index}].key`}
                control={control}
              />
            </Box>
            <Box width={[1, 7 / 12]} mr={[0, 0]}>
              <Controller
                key={`${name}[${index}]-${item.id}-value`}
                render={({ field }) => (
                  <Input {...field} label="Value" placeholder="" />
                )}
                name={`${name}[${index}].value`}
                control={control}
              />
            </Box>
            <Box width={[1, 1 / 12]} alignSelf="end">
              <Button
                variant="unstyled"
                type="button"
                sx={{ float: 'right' }}
                onClick={() => remove(index)}
              >
                <MdDelete size={30} />
              </Button>
            </Box>
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
