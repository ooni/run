import { Flex, Box, Button, Heading } from "ooni-components"
import { useForm, useFieldArray } from "react-hook-form"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

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
  const { control, register, formState, watch } = useForm({
    mode: 'onTouched',
    defaultValues: { urls: [ { url: 'https://' } ] },
    resolver: yupResolver(validationSchema)
  })
  const { isDirty, errors } = formState

  const { fields, append, remove } = useFieldArray({
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

  return (
    <Flex flexDirection='column'>
      <Heading h={2}>
        <FormattedMessage id='Title.URLs' defaultMessage='URLs' />
      </Heading>
      <Flex flexDirection='column' my={3}>
        {controlledFields.map((field, index) => (
          <Flex key={index} alignItems='center'>
            <input key={field.id} {...register(`urls.${index}.url`)} />
            <button onClick={() => remove(index)}>⛔️</button>
            <Box as='small' color='red'>{ errors?.['urls']?.[index]?.['url']?.message }</Box>
          </Flex>
        ))}
      </Flex>
      <Box my={2}>
        <AddURLButton onClick={() => append({ url: 'https://' })}>
          + <FormattedMessage id='Button.AddUrl' defaultMessage='Add URL' />
        </AddURLButton>
      </Box>
      <Button onClick={toggleGenerate}>
        <FormattedMessage id='Button.Generate' defaultMessage='Generate' />
      </Button>
    </Flex>
  )
}

export default URLs