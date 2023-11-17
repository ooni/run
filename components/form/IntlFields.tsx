import { useFieldArray, Controller, useFormContext } from 'react-hook-form'
import { Flex, Box, Input, Select, Button } from 'ooni-components'
import { FieldsPropTypes } from './TestListForm'
import { MdDelete } from 'react-icons/md'
import supportedLanguages from '../../utils/supportedLanguages'

const langOptions = supportedLanguages.map((lang) => ({
  key: lang,
  name: new Intl.DisplayNames(['en'], { type: 'language' }).of(
    lang.replace('_', '-')
  ),
}))

const IntlFields = ({ name }: FieldsPropTypes) => {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
    <>
      {fields.map((item, index) => (
        <Box key={item.id} mt={3}>
          <Flex>
            <Box width={[1, 4 / 12]} mr={[0, 2]}>
              <Controller
                render={({ field }) => (
                  <Select {...field} label="Language" width={1}>
                    <option value=""></option>
                    {langOptions.map(({ key, name }) => (
                      <option key={key} value={key}>
                        {name}
                      </option>
                    ))}
                  </Select>
                )}
                name={`${name}[${index}].key`}
                control={control}
              />
            </Box>
            <Box width={[1, 8 / 12]}>
              <Flex flexDirection='row'>
                <Box width={1}>
                  <Controller
                    render={({ field }) => (
                      <Input width={1} label="Translation" {...field} />
                    )}
                    name={`${name}[${index}].value`}
                    control={control}
                  />
                </Box>
                <Box alignSelf="end" mb={1}>
                  <Button
                    variant="link"
                    color="black"
                    sx={{ float: 'right' }}
                    onClick={() => remove(index)}
                  >
                    <MdDelete size={30} />
                  </Button>
                </Box>
              </Flex>
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
