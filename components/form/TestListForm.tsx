import { useCallback, ClipboardEvent, useMemo, useState } from 'react'
import { Flex, Box, Button, Heading, Text, Input, Modal } from 'ooni-components'
import {
  useForm,
  useFieldArray,
  Controller,
  FormProvider,
} from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import useSWRMutation from 'swr/mutation'
import styled from 'styled-components'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import * as FAIcons from 'react-icons/fa6'
import IntlFields from './IntlFields'
import NettestFields from './NettestFields'
import { apiEndpoints, fetcher, postFetcher } from 'lib/api'
import ButtonSpinner from 'components/ButtonSpinner'
import { useRouter } from 'next/router'

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
        name: Yup.string().required('Cannot be empty'),
        short_description: Yup.string().defined(),
        description: Yup.string().defined(),
        icon: Yup.string().defined(),
        author: Yup.string().defined(),
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

type TestListFormProps = {
  onSubmit: (data: {}) => void
  defaultValues?: object
  linkId?: string
}

const TestListForm = ({
  onSubmit,
  defaultValues,
  linkId,
}: TestListFormProps) => {
  const { push } = useRouter()
  const values = defaultValues || initialValues

  const formMethods = useForm<TestList>({
    mode: 'onTouched',
    defaultValues: { ooniRunLink: [values] },
    resolver: yupResolver(validationSchema),
  })
  const { control, formState, handleSubmit, setValue, watch } = formMethods
  const iconValue = watch('ooniRunLink.0.icon')

  const selectedIcon = useMemo(() => {
    if (FAIcons[iconValue as keyof typeof FAIcons]) {
      const Icon = FAIcons[iconValue as keyof typeof FAIcons]
      return <Icon />
    }
  }, [iconValue])
  const { errors, isSubmitting } = formState

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'ooniRunLink', // unique name for your Field Array
  })

  const { trigger, isMutating } = useSWRMutation(
    linkId && apiEndpoints.ARCHIVE_RUN_LINK.replace(':oonirun_id', linkId),
    postFetcher,
    {
      onSuccess: () => {
        push(`/view/${linkId}`)
      },
    }
  )

  const [showIconModal, setShowIconModal] = useState(false)

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
                      <Input type="hidden" {...field} label="Icon" />
                    )}
                    name={`ooniRunLink.${index}.icon`}
                    control={control}
                  />
                  <Box fontSize={3}>{selectedIcon}</Box>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowIconModal(true)}
                  >
                    Select icon
                  </Button>
                  <Modal
                    show={showIconModal}
                    p={4}
                    onHideClick={() => setShowIconModal(false)}
                  >
                    <Flex flexWrap="wrap" sx={{ gap: '4px' }}>
                      {Object.entries(FAIcons).map(([name, icon], i) => {
                        const IconComponent = icon
                        return (
                          <Box
                            key={name}
                            sx={{
                              width: '10%',
                              border: '1px solid black',
                              borderRadius: '2px',
                              cursor: 'pointer',
                              textAlign: 'center',
                              '&:hover': {
                                bg: 'gray2',
                              },
                            }}
                            p={2}
                            fontSize={3}
                            onClick={() => {
                              setValue(`ooniRunLink.${index}.icon`, name, {
                                shouldValidate: false,
                              })
                              setShowIconModal(false)
                            }}
                          >
                            <IconComponent />
                          </Box>
                        )
                      })}
                    </Flex>
                  </Modal>
                </StyledInputWrapper>
                <Heading h={4} fontWeight={300} mt={4}>
                  Nettests
                </Heading>
                <NettestFields name={`ooniRunLink.${index}.nettests`} />
              </Box>
            ))}
            <Button
              width={1 / 4}
              mx="auto"
              type="submit"
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
          </Flex>
        </form>
      </FormProvider>
    </Flex>
  )
}

export default TestListForm
