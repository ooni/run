import { useCallback, ClipboardEvent } from 'react'
import {
  Flex,
  Box,
  Button,
  Heading,
  // InputWithIconButton,
  Text,
  Input,
  // Label,
  // Select,
} from 'ooni-components'
import {
  useForm,
  useFieldArray,
  Controller,
  Control,
  FormProvider,
  useFormContext,
} from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import * as reactCom from 'react-icons/md'
import IconSelect from 'react-select'
import IntlFields from './IntlFields'
import NettestFields from './NettestFields'

export type FieldsPropTypes = {
  name: string
}

export const StyledLabel = styled(Text).attrs({
  // color: 'blue5',
  fontSize: 1,
  fontWeight: 600,
})``

export const StyledInputWrapper = styled.div`
  margin-bottom: ${(props) => props.theme.space[4]}px;
`

type Nettest = {
  test_name: string
  inputs: string[]
  options: { key?: string; value?: string }[]
  backend_options: { key?: string; value?: string }[]
  is_background_run_enabled: boolean
  is_manual_run_enabled: boolean
}

type TestList = {
  ooniRunLink: Array<{
    name: string
    short_description: string
    description: string
    icon: string
    author: string
    nettests: Nettest[]
  }>
}

const validationSchema = Yup.object({
  ooniRunLink: Yup.array()
    .required()
    .min(0)
    .of(
      Yup.object({
        name: Yup.string().required('cannot be empty'),
        short_description: Yup.string().required().min(0),
        description: Yup.string().required().min(0),
        icon: Yup.string().required().min(0),
        author: Yup.string().required().min(0),
        nettests: Yup.array()
          .required()
          .of(
            Yup.object({
              test_name: Yup.string().required('cannot be empty'),
              inputs: Yup.array()
                .required()
                .min(0)
                .of(
                  Yup.string()
                    .required()
                    .min(0)
                    .test(
                      'is-valid-url',
                      'should be a valid URL format e.g "https://ooni.org/post/"',
                      (value) => {
                        if (value == null) return true
                        try {
                          const url = new URL(value)
                          if (
                            url.protocol != 'http:' &&
                            url.protocol != 'https:'
                          ) {
                            return false
                          }
                          return true
                        } catch {
                          return false
                        }
                      }
                    )
                ),
              options: Yup.array()
                .required()
                .min(0)
                .of(Yup.object({ key: Yup.string(), value: Yup.string() })),
              backend_options: Yup.array()
                .required()
                .min(0)
                .of(Yup.object({ key: Yup.string(), value: Yup.string() })),
              is_background_run_enabled: Yup.boolean(),
              is_manual_run_enabled: Yup.boolean(),
            })
          ),
      })
    ),
})

const initialValues = {
  name: '',
  short_description: '',
  description: '',
  icon: '',
  author: '',
  nettests: [
    {
      test_name: '',
      inputs: [],
      options: [],
      backend_options: [],
      is_background_run_enabled: false,
      is_manual_run_enabled: false,
    },
  ],
}

// const selectIconOptions = Object.entries(reactCom).map(([name, icon]) => {
//   // const IconComponent = reactCom[name]
//   return {
//     value: name,
//     // label: <IconComponent />,
//     label: name,
//   }
// })

type TestListFormProps = {
  onSubmit: (data: {}) => void
  defaultValues?: object
}

const TestListForm = ({ onSubmit, defaultValues }: TestListFormProps) => {
  const values = defaultValues || initialValues

  const formMethods = useForm<TestList>({
    mode: 'onTouched',
    defaultValues: { ooniRunLink: [values] },
    resolver: yupResolver(validationSchema),
  })
  const { control, formState, handleSubmit } = formMethods

  const { errors } = formState

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'ooniRunLink', // unique name for your Field Array
  })

  return (
    <Flex flexDirection="column">
      {/* <Heading h={2} mt={4}>
        <FormattedMessage id="Title.URLs" defaultMessage="URLs" />
      </Heading>
      <Text fontWeight="lighter">
        <FormattedMessage
          id="Notice.Paste"
          defaultMessage="Note: If you have a long list of URLs to add, you can copy them and paste into one of the boxes below."
        />
      </Text> */}
      <datalist id="url-prefixes">
        <option value="https://" />
        <option value="http://" />
      </datalist>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection="column" my={3}>
            {fields.map((item, index) => (
              <Box key={item.id}>
                <StyledInputWrapper>
                  <Controller
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Test list name"
                        placeholder=""
                        error={errors?.ooniRunLink?.[index]?.name?.message}
                      />
                    )}
                    name={`ooniRunLink.${index}.name`}
                    control={control}
                  />
                  <IntlFields name={`ooniRunLink.${index}.name_intl`} />
                </StyledInputWrapper>
                <StyledInputWrapper>
                  <Controller
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Short description"
                        placeholder=""
                      />
                    )}
                    name={`ooniRunLink.${index}.short_description`}
                    control={control}
                  />
                  <IntlFields
                    name={`ooniRunLink.${index}.short_description_intl`}
                  />
                </StyledInputWrapper>
                <StyledInputWrapper>
                  <Controller
                    render={({ field }) => (
                      <Input {...field} label="Description" placeholder="" />
                    )}
                    name={`ooniRunLink.${index}.description`}
                    control={control}
                  />
                  <IntlFields name={`ooniRunLink.${index}.description_intl`} />
                </StyledInputWrapper>
                <StyledInputWrapper>
                  <Controller
                    render={({ field }) => (
                      <Input {...field} label="Author" placeholder="" />
                    )}
                    name={`ooniRunLink.${index}.author`}
                    control={control}
                  />
                </StyledInputWrapper>
                <StyledInputWrapper>
                  <Controller
                    render={({ field }) => (
                      // render={({ field: { value, onChange } }) => (
                      // <IconSelect
                      //   options={selectIconOptions}
                      //   value={selectIconOptions.find((c) => c.value === value)}
                      //   onChange={(selectedOption) => {
                      //     onChange(selectedOption?.value)
                      //   }}
                      // />
                      <Input {...field} label="Icon" placeholder="" />
                    )}
                    name={`ooniRunLink.${index}.icon`}
                    control={control}
                  />
                </StyledInputWrapper>
                <Heading h={4} fontWeight={300} mt={4}>
                  Nettests
                </Heading>
                <NettestFields name={`ooniRunLink.${index}.nettests`} />
              </Box>
            ))}
            <Button width={1 / 4} mx="auto" type="submit">
              <FormattedMessage
                id="Button.Generate"
                defaultMessage="Generate"
              />
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </Flex>
  )
}

export default TestListForm
