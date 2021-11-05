import { useCallback } from "react"
import { Flex, Box, Button, Heading, InputWithIconButton, Text } from "ooni-components"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import MdDelete from 'react-icons/lib/md/delete'

const AddURLButton = styled(Button)`
  color: ${props => props.theme.colors.gray5};
  border-radius: 0;
  padding: 0;
  background-color: transparent;
  border-bottom: 1px solid ${props => props.theme.colors.gray1};
  text-align: left;
  text-transform: none;

  &:hover, &:hover:enabled {
    background-color: transparent;
    color: ${props => props.theme.colors.gray6};
    border-bottom: 1px solid ${props => props.theme.colors.gray3};
  }
  &:active, &:active:enabled {
    background-color: transparent;
    color: ${props => props.theme.colors.gray7};
    border-bottom: 2px solid ${props => props.theme.colors.gray4};
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

// Based on https://github.com/citizenlab/test-lists/blob/fd9620f6402f66f7835a831fdcd0731b449e9c52/scripts/lint-lists.py#L18
const urlValidityRegex = /^(?:http)s?:\/\/(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:\/?|[/?]\S+)$/i

const validationSchema = Yup.object().shape({
  urls: Yup.array().of(
      Yup.object().shape({
          url: Yup.string()
              .required('cannot be empty')
              .matches(/^http(s?)/, 'should start with "https" or "http"')
              .matches(urlValidityRegex, 'should be a valid URL format e.g "https://ooni.org/post/"')
              .matches(/\/$/, 'should end with a slash e.g "https://ooni.org/"')
      // more validations here
      })
  )
});

const URLs = ({ toggleGenerate }) => {
  const { control, formState, watch, trigger } = useForm({
    mode: 'onTouched',
    defaultValues: { urls: [ { url: '' } ] },
    resolver: yupResolver(validationSchema)
  })
  const { isDirty, isValid, errors } = formState

  const { fields, append, remove, insert, update } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "urls", // unique name for your Field Array
  })
  const watchFieldArray = watch('urls')
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    }
  })

  const onKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      append({ url: '' })
    }
  }, [append])

  const handlePaste = useCallback((e, index, onChange) => {
    // block the usual paste action
    e.preventDefault()

    const pastedText = e.clipboardData.getData('Text')
    const newEntries = pastedText.split('\n').map((line, i) => (
      { url: line }
    ))

    // Place first pasted entry into event and trigger onChange
    // This updates the field being pasted into with the first entry
    e.target.value = newEntries[0].url
    onChange(e)
    
    // Insert fields into the form using the rest of the entries
    insert(index + 1, newEntries.slice(1))

    // Trigger validation to show any errors in the new entries
    trigger()
  }, [append, insert, update])

  return (
    <Flex flexDirection='column'>
      <Heading h={2}>
        <FormattedMessage id='Title.URLs' defaultMessage='URLs' />
      </Heading>
      <Text fontWeight='lighter'>
        <FormattedMessage id='Notice.Paste' defaultMessage='Note: If you have a long list of URLs to add, you can copy them and paste into one of the boxes below.' />
      </Text>
      <Flex flexDirection='column' my={3}>
        {controlledFields.map((field, index) => (
          <Controller
            render={({ field }) => (
              // <input {...field} />
              <StyleFixIconButton key={`url-${index}`} className='input-with-button'>
                <InputWithIconButton
                  {...field}
                  className='url-input'
                  value={field.value}
                  icon={<MdDelete />}
                  placeholder='https://'
                  error={errors?.['urls']?.[index]?.['url']?.message}
                  onKeyPress={onKeyPress}
                  onAction={() => remove(index)}
                  onPaste={(e) => handlePaste(e, index, field.onChange)}
                />
              </StyleFixIconButton>
            )}
            name={`urls.${index}.url`}
            control={control}
          />
        ))}
      </Flex>
      <Box my={2}>
        <AddURLButton onClick={() => append({ url: '' })}>
          + <FormattedMessage id='Button.AddUrl' defaultMessage='Add URL' />
        </AddURLButton>
      </Box>
      <Button onClick={toggleGenerate} disabled={!isValid}>
        <FormattedMessage id='Button.Generate' defaultMessage='Generate' />
      </Button>
    </Flex>
  )
}

export default URLs