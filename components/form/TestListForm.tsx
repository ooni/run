import { Flex, Box, Button, Text, Input } from 'ooni-components'
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from 'react-hook-form'
import Compact from '@uiw/react-color-compact'
import { FormattedMessage } from 'react-intl'
import useSWRMutation from 'swr/mutation'
import styled from 'styled-components'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import IntlFields from './IntlFields'
import AdminNettestFields from './AdminNettestFields'
import NettestFields from './NettestFields'
import IconModal from './IconModal'
import { apiEndpoints, getUserEmail, postFetcher } from 'lib/api'
import ButtonSpinner from 'components/ButtonSpinner'
import { useRouter } from 'next/router'

import { Checkbox } from 'ooni-components'
import useIcon from 'hooks/useIcon'
import { FaCheck } from 'react-icons/fa6'

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

export type TestList = {
  ooniRunLink: Array<{
    name: string
    short_description: string
    description: string
    icon: string
    color: string
    author: string
    include_author: boolean
    nettests: Nettest[]
  }>
}

const validationSchema = Yup.object({
  ooniRunLink: Yup.array()
    .required()
    .min(0)
    .of(
      Yup.object({
        name: Yup.string().required('Cannot be empty'),
        short_description: Yup.string().defined(),
        description: Yup.string().defined(),
        icon: Yup.string().defined(),
        color: Yup.string().defined(),
        author: Yup.string().defined(),
        include_author: Yup.boolean().defined(),
        nettests: Yup.array()
          .required()
          .of(
            Yup.object({
              test_name: Yup.string().required('Cannot be empty'),
              inputs: Yup.array()
                .required()
                .min(0)
                .of(
                  Yup.string()
                    .defined()
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
              is_background_run_enabled: Yup.boolean().defined(),
              is_manual_run_enabled: Yup.boolean().defined(),
            })
          ),
      })
    ),
})

type TestListFormProps = {
  onSubmit: (data: {}) => void
  defaultValues: object
  linkId?: string
  isAdmin?: boolean
}

const TestListForm = ({
  isAdmin = false,
  onSubmit,
  defaultValues,
  linkId,
}: TestListFormProps) => {
  const { push } = useRouter()

  const formMethods = useForm<TestList>({
    mode: 'onTouched',
    defaultValues: { ooniRunLink: [defaultValues] },
    resolver: yupResolver(validationSchema),
  })
  const { control, formState, handleSubmit, setValue, watch } = formMethods
  const iconValue = watch('ooniRunLink.0.icon')

  const selectedIcon = useIcon(iconValue)
  const { errors, isSubmitting } = formState

  // console.log("errors", errors)

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'ooniRunLink', // unique name for your Field Array
  })

  const { trigger, isMutating } = useSWRMutation(
    linkId && apiEndpoints.ARCHIVE_RUN_LINK.replace(':oonirun_id', linkId),
    postFetcher,
    {
      onSuccess: () => {
        push(`/v2/${linkId}`)
      },
    }
  )

  return (
    <Flex flexDirection="column">
      <datalist id="url-prefixes">
        <option value="https://" />
        <option value="http://" />
      </datalist>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection="column" my={3}>
            <Box alignSelf="end" my={3}>
              {linkId && (
                <Button
                  type="button"
                  color="red"
                  sx={{ borderColor: 'red' }}
                  hollow
                  onClick={() => trigger()}
                  loading={isMutating}
                  disabled={isMutating}
                  spinner={<ButtonSpinner />}
                >
                  Archive
                </Button>
              )}
            </Box>
            {fields.map((item, index) => (
              <Box key={item.id}>
                <StyledInputWrapper>
                  <Controller
                    render={({ field }) => (
                      <Input type="hidden" {...field} label="Icon" />
                    )}
                    name={`ooniRunLink.${index}.icon`}
                    control={control}
                  />
                  <Box fontSize={3}>{selectedIcon}</Box>
                  <IconModal 
                    setValue={setValue}
                    iconValue={iconValue}
                  />
                </StyledInputWrapper>
                <StyledInputWrapper>
                  <StyledLabel mb={1}>Color</StyledLabel>
                  <Controller
                    render={({ field }) =>(
                      <Compact
                        {...field}
                        color={field.value}
                        style={{
                          border: '1px solid gray',
                        }}
                        onChange={(color) => {
                          field.onChange(color.hex);
                        }}
                      />
                    )}
                    name={`ooniRunLink.${index}.color`}
                    control={control}
                  />
                </StyledInputWrapper>
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
                      <Input {...field} disabled bg='gray3' label="Author's Email" />
                    )}
                    name={`ooniRunLink.${index}.author`}
                    control={control}
                  />
                  <Controller
                    render={({ field }) => (
                      <Box mt={2}>
                        <Checkbox 
                          {...field}
                          reverse
                          checked={field.value}
                          label={`Show my email “${getUserEmail()}” in the link info`}
                        />
                      </Box>
                    )}
                    name={`ooniRunLink.${index}.include_author`}
                    control={control}
                  />
                </StyledInputWrapper>
                {isAdmin ? (
                  <AdminNettestFields name={`ooniRunLink.${index}.nettests`} />
                ) : (
                  <NettestFields name={`ooniRunLink.${index}.nettests`} />
                )}

              </Box>
            ))}
            <Box textAlign="end" mb={4}>
              <Button
                type="submit"
                endIcon={<FaCheck />}
                loading={isSubmitting}
                disabled={isSubmitting}
                spinner={<ButtonSpinner />}
              >
                {linkId ? (
                  <FormattedMessage id="Button.Update" />
                ) : (
                  <FormattedMessage id="Button.Generate" />
                )}
              </Button>
            </Box>
          </Flex>
        </form>
      </FormProvider>
    </Flex>
  )
}

export default TestListForm
