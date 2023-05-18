import { useCallback, ClipboardEvent } from 'react'
import {
  Flex,
  Box,
  Button,
  Heading,
  InputWithIconButton,
  Text,
  Input,
  Label,
  Select,
} from 'ooni-components'
import { useForm, useFieldArray, Controller, Control } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { MdDelete } from 'react-icons/md'

const AddURLButton = styled(Button)`
  color: ${(props) => props.theme.colors.gray5};
  border-radius: 0;
  padding: 0;
  background-color: transparent;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray1};
  text-align: left;
  text-transform: none;

  &:hover,
  &:hover:enabled {
    background-color: transparent;
    color: ${(props) => props.theme.colors.gray6};
    border-bottom: 1px solid ${(props) => props.theme.colors.gray3};
  }
  &:active,
  &:active:enabled {
    background-color: transparent;
    color: ${(props) => props.theme.colors.gray7};
    border-bottom: 2px solid ${(props) => props.theme.colors.gray4};
  }
`

const StyleFixIconButton = styled.div`
  & ${Flex} {
    align-items: center;
  }
  & p {
    margin-top: 8px;
  }
  & button:hover:enabled {
    background-color: transparent;
  }
  & button:active:enabled {
    background-color: transparent;
  }
`

const StyledLabel = styled(Label).attrs({
  color: 'blue5',
  fontSize: 14,
})``

const StyledAddButton = styled.a`
  display: block;
  color: ${(props) => props.theme.colors.blue5};
  margin-top: ${(props) => props.theme.space[2]}px;
  cursor: pointer;
`

const StyledInputWrapper = styled.div`
  margin-bottom: ${(props) => props.theme.space[4]}px;
`

const validationSchema = Yup.object().shape({
  urls: Yup.array().of(
    Yup.object().shape({
      url: Yup.string()
        .required('cannot be empty')
        .test(
          'is-valid-url',
          'should be a valid URL format e.g "https://ooni.org/post/"',
          (value) => {
            try {
              const url = new URL(value)
              if (url.protocol != 'http:' && url.protocol != 'https:') {
                return false
              }
              return true
            } catch {
              return false
            }
          }
        ),
    })
  ),
})

const subm = (state: {}) => {
  console.log(state)
}

type URLsProps = {
  onSubmit: ({ urls }: { urls: Array<{ url: string }> }) => void
}

const URLs = ({ onSubmit }: URLsProps) => {
  const { control, formState, trigger, handleSubmit } = useForm({
    mode: 'onTouched',
    defaultValues: {
      ooniRunLink: [
        {
          name: '',
          short_description: '',
          description: '',
          icon: '',
          author: '',
          nettests: [
            {
              test_name: '',
              inputs: [''],
              options: [],
              backend_options: [],
              is_background_run_enabled: false,
              is_manual_run_enabled: false,
            },
          ],
          is_archived: '',
        },
      ],
    },
    resolver: yupResolver(validationSchema),
  })
  const { errors } = formState
  console.log('formStateformState', formState)
  const { fields, append, remove, insert, replace } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'ooniRunLink', // unique name for your Field Array
  })

  const onKeyPress = useCallback(
    (e: KeyboardEvent) => {
      console.log('keypress')
      // if (e.key === 'Enter') {
      //   append({ url: '' }, { shouldFocus: true })
      // }
    },
    [append]
  )

  const handlePaste = useCallback(
    (
      e: ClipboardEvent,
      index: number,
      onChange: (event: ClipboardEvent) => void
    ) => {
      console.log('paste')
      // // block the usual paste action
      // e.preventDefault()

      // const pastedText = e.clipboardData.getData('Text')
      // const newEntries = pastedText
      //   .split('\n')
      //   .filter((line: string) => line.length > 0)
      //   .map((line: string) => ({ url: line }))

      // // Place first pasted entry into event and trigger onChange
      // // This updates the field being pasted into with the first entry
      // const eventTarget = e.target as HTMLInputElement
      // eventTarget.value = newEntries[0].url
      // onChange(e)

      // // Insert fields into the form using the rest of the entries
      // insert(index + 1, newEntries.slice(1))

      // // Trigger validation to show any errors in the new entries
      // trigger()
    },
    [append, insert, replace]
  )

  return (
    <Flex flexDirection="column">
      <Heading h={2} mt={4}>
        {/* <FormattedMessage id="Title.URLs" defaultMessage="URLs" /> */}
        TEST LIST
      </Heading>
      <Text fontWeight="lighter">
        <FormattedMessage
          id="Notice.Paste"
          defaultMessage="Note: If you have a long list of URLs to add, you can copy them and paste into one of the boxes below."
        />
      </Text>
      <datalist id="url-prefixes">
        <option value="https://" />
        <option value="http://" />
      </datalist>
      <form onSubmit={handleSubmit(subm)}>
        <Flex flexDirection="column" my={3}>
          {fields.map((item, index) => (
            // <Controller
            //   key={item.id}
            //   render={({ field }) => (
            //     <StyleFixIconButton className="input-with-button">
            //       <InputWithIconButton
            //         {...field}
            //         className="url-input"
            //         icon={<MdDelete size={30} />}
            //         placeholder="https://twitter.com/"
            //         list="url-prefixes"
            //         error={errors?.['urls']?.[index]?.['url']?.message}
            //         onKeyPress={onKeyPress}
            //         onAction={() => remove(index)}
            //         onPaste={(e: ClipboardEvent) =>
            //           handlePaste(e, index, field.onChange)
            //         }
            //       />
            //     </StyleFixIconButton>
            //   )}
            //   name={`urls.${index}.url`}
            //   control={control}
            // />
            //     <Box my={2}>
            //   <AddURLButton onClick={() => append({ url: '' })}>
            //     + <FormattedMessage id="Button.AddUrl" defaultMessage="Add URL" />
            //   </AddURLButton>
            // </Box>
            <Box key={`${item.id}-${index}`}>
              <StyledInputWrapper>
                <StyledLabel>Test list name</StyledLabel>
                <Controller
                  key={`name-${item.id}`}
                  render={({ field }) => <Input {...field} placeholder="" />}
                  name={`ooniRunLink.${index}.name`}
                  control={control}
                />
                <IntlArray
                  control={control}
                  name={`ooniRunLink.${index}.name_intl`}
                />
              </StyledInputWrapper>
              <StyledInputWrapper>
                <StyledLabel>Short description</StyledLabel>
                <Controller
                  key={`short-desc-${item.id}`}
                  render={({ field }) => <Input {...field} placeholder="" />}
                  name={`ooniRunLink.${index}.short_description`}
                  control={control}
                />
                <IntlArray
                  control={control}
                  name={`ooniRunLink.${index}.short_description_intl`}
                />
              </StyledInputWrapper>
              <StyledInputWrapper>
                <StyledLabel>Description</StyledLabel>
                <Controller
                  key={`desc-${item.id}`}
                  render={({ field }) => <Input {...field} placeholder="" />}
                  name={`ooniRunLink.${index}.description`}
                  control={control}
                />
                <IntlArray
                  control={control}
                  name={`ooniRunLink.${index}.description_intl`}
                />
              </StyledInputWrapper>
              <StyledInputWrapper>
                <StyledLabel>Author</StyledLabel>
                <Controller
                  key={`author-${item.id}`}
                  render={({ field }) => <Input {...field} placeholder="" />}
                  name={`ooniRunLink.${index}.author`}
                  control={control}
                />
              </StyledInputWrapper>
              <Heading h={4} fontWeight={300} mt={4}>
                Nettests
              </Heading>
              <NettestArray
                control={control}
                name={`ooniRunLink.${index}.nettests`}
              />
            </Box>
          ))}
          <Button width={1 / 4} mx="auto" type="submit">
            <FormattedMessage id="Button.Generate" defaultMessage="Generate" />
          </Button>
        </Flex>
      </form>
    </Flex>
  )
}

type PropTypes = {
  control: Control<any>
  name: string
}

function NettestArray({ control, name }: PropTypes) {
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
    <>
      <ul>
        {fields.map((item, index) => (
          <li key={`${name}[${index}]-${item.id}`}>
            {index > 0 && <hr />}
            <StyledInputWrapper>
              <StyledLabel>Nettest name</StyledLabel>
              <Controller
                key={`nettests-test_name-${item.id}`}
                render={({ field }) => <Input {...field} placeholder="" />}
                name={`${name}[${index}].test_name`}
                control={control}
              />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <StyledLabel>Options</StyledLabel>
              <OptionsArray
                control={control}
                name={`${name}[${index}].options`}
              />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <StyledLabel>Backend options</StyledLabel>
              <BackendOptionsArray
                control={control}
                name={`${name}[${index}].backend_options`}
              />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <StyledLabel>Inputs</StyledLabel>
              <InputsArray
                control={control}
                name={`${name}[${index}].inputs`}
              />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <StyledLabel>Background run</StyledLabel>
              <Controller
                key={`nettests-is_background_run_enabled-${item.id}`}
                render={({ field }) => (
                  <Label htmlFor="backgroundRun" alignItems="center">
                    <input
                      {...field}
                      id="backgroundRun"
                      type="checkbox"
                      checked={field.value}
                    />
                    <Box mx={1}>Enable</Box>
                  </Label>
                )}
                name={`${name}[${index}].is_background_run_enabled`}
                control={control}
              />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <StyledLabel>Manual run</StyledLabel>
              <Controller
                key={`nettests-is_manual_run_enabled-${item.id}`}
                render={({ field }) => (
                  <Label htmlFor="manualRun" alignItems="center">
                    <input
                      {...field}
                      id="manualRun"
                      type="checkbox"
                      checked={field.value}
                    />
                    <Box mx={1}>Enable</Box>
                  </Label>
                )}
                name={`${name}[${index}].is_manual_run_enabled`}
                control={control}
              />
            </StyledInputWrapper>
            {index > 0 && (
              <a onClick={() => remove(index)}>
                <MdDelete size={30} />
              </a>
            )}
          </li>
        ))}
      </ul>
      <Button
        hollow
        mr="auto"
        my={3}
        onClick={() => {
          append({ test_name: '', options: '' })
        }}
      >
        + Add nettest
      </Button>
    </>
  )
}

function IntlArray({ control, name }: PropTypes) {
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
    <>
      <ul>
        {fields.map((item, index) => (
          <li key={`${name}[${index}]-${item.id}`}>
            <Flex>
              <Box width={[1, 4 / 12]} mr={[0, 3]}>
                <StyledLabel>Language</StyledLabel>
                <Controller
                  key={`${name}[${index}]-${item.id}-key`}
                  render={({ field }) => (
                    <Select {...field} width={1}>
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
              <Box width={[1, 7 / 12]} mr={[0, 3]}>
                <StyledLabel>Translated string</StyledLabel>
                <Controller
                  key={`${name}[${index}]-${item.id}-value`}
                  render={({ field }) => (
                    <Input {...field} placeholder="Translated string" />
                  )}
                  name={`${name}[${index}].value`}
                  control={control}
                />
              </Box>
              <Box width={[1, 1 / 12]}>
                <a onClick={() => remove(index)}>
                  <MdDelete size={30} />
                </a>
              </Box>
            </Flex>
          </li>
        ))}
      </ul>
      <StyledAddButton
        onClick={() => {
          append({ key: '', value: '' })
        }}
      >
        + Add translation
      </StyledAddButton>
    </>
  )
}

function OptionsArray({ control, name }: PropTypes) {
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
    <>
      <ul>
        {fields.map((item, index) => (
          <li key={`${name}[${index}]-${item.id}`}>
            <Flex>
              <Box width={[1, 4 / 12]} mr={[0, 3]}>
                <Controller
                  key={`${name}[${index}]-${item.id}-key`}
                  render={({ field }) => (
                    <Input {...field} placeholder="Option key" />
                  )}
                  name={`${name}[${index}].key`}
                  control={control}
                />
              </Box>
              <Box width={[1, 7 / 12]} mr={[0, 3]}>
                <Controller
                  key={`${name}[${index}]-${item.id}-value`}
                  render={({ field }) => (
                    <Input {...field} placeholder="Option value" />
                  )}
                  name={`${name}[${index}].value`}
                  control={control}
                />
              </Box>
              <Box width={[1, 1 / 12]}>
                <a onClick={() => remove(index)}>
                  <MdDelete size={30} />
                </a>
              </Box>
            </Flex>
          </li>
        ))}
      </ul>
      <StyledAddButton
        onClick={() => {
          append({ key: '', value: '' })
        }}
      >
        + Add option
      </StyledAddButton>
    </>
  )
}

function BackendOptionsArray({ control, name }: PropTypes) {
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
    <>
      <ul>
        {fields.map((item, index) => (
          <li key={`${name}[${index}]-${item.id}`}>
            <Flex>
              <Box width={[1, 4 / 12]} mr={[0, 3]}>
                <Controller
                  key={`${name}[${index}]-${item.id}-key`}
                  render={({ field }) => (
                    <Input {...field} placeholder="Backend option key" />
                  )}
                  name={`${name}[${index}].key`}
                  control={control}
                />
              </Box>
              <Box width={[1, 7 / 12]} mr={[0, 3]}>
                <Controller
                  key={`${name}[${index}]-${item.id}-value`}
                  render={({ field }) => (
                    <Input {...field} placeholder="Backend option value" />
                  )}
                  name={`${name}[${index}].value`}
                  control={control}
                />
              </Box>
              <Box width={[1, 1 / 12]}>
                <a onClick={() => remove(index)}>
                  <MdDelete size={30} />
                </a>
              </Box>
            </Flex>
          </li>
        ))}
      </ul>
      <StyledAddButton
        onClick={() => {
          append({ key: '', value: '' })
        }}
      >
        + Add backend option
      </StyledAddButton>
    </>
  )
}

function InputsArray({ control, name }: PropTypes) {
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
    <>
      <ul>
        {fields.map((item, index) => (
          <li key={`${name}[${index}]-${item.id}`}>
            <Flex>
              <Box width={11 / 12}>
                <Controller
                  key={`input-${item.id}`}
                  render={({ field }) => (
                    <Input {...field} placeholder="Input" />
                  )}
                  name={`${name}[${index}]`}
                  control={control}
                />
              </Box>
              <Box width={1 / 12}>
                <a onClick={() => remove(index)}>
                  <MdDelete size={30} />
                </a>
              </Box>
            </Flex>
          </li>
        ))}
      </ul>
      <StyledAddButton
        onClick={() => {
          append('')
        }}
      >
        + Add input
      </StyledAddButton>
    </>
  )
}

export default URLs
