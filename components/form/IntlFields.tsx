import { useFieldArray, Controller, useFormContext } from 'react-hook-form'
import { Flex, Box, Input, Select, Button } from 'ooni-components'
import { FieldsPropTypes } from './TestListForm'
import { MdDelete } from 'react-icons/md'

const IntlFields = ({ name }: FieldsPropTypes) => {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
    <>
      {fields.map((item, index) => (
        <Box key={item.id} mt={3}>
          <Flex>
            <Box width={[1, 4 / 12]} mr={[0, 2]} ml={[0, 4]}>
              <Controller
                render={({ field }) => (
                  <Select {...field} label="Language" width={1}>
                    <option value=""></option>
                    {['it', 'fr', 'de'].map((c, idx) => (
                      <option key={idx} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                )}
                name={`${name}[${index}].key`}
                control={control}
              />
            </Box>
            <Box width={[1, 7 / 12]}>
              <Controller
                render={({ field }) => (
                  <Input label="Translation" {...field} placeholder="" />
                )}
                name={`${name}[${index}].value`}
                control={control}
              />
            </Box>
            <Box width={[1, 1 / 12]} alignSelf="end" mb={1}>
              <Button
                variant="link"
                type="button"
                color="black"
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
        + Add translation
      </Button>
    </>
  )
}

export default IntlFields
