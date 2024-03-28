import { yupResolver } from "@hookform/resolvers/yup"
import Compact from "@uiw/react-color-compact"
import { format } from "date-fns"
import { getUserEmail } from "lib/api"
import { Box, Button, Flex, Input, Text } from "ooni-components"
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"
import * as Yup from "yup"

import DescriptorIcon from "components/DescriptorIcon"
import dynamic from "next/dynamic"
import { Checkbox, Textarea } from "ooni-components"
import { useEffect, useState } from "react"
import { FaCheck } from "react-icons/fa6"
import { icons } from "utils/icons"
import DatePicker from "./DatePicker"

const IconModal = dynamic(() => import("./IconModal"))
const IntlFields = dynamic(() => import("./IntlFields"))
const NettestFields = dynamic(() => import("./NettestFields"))
const AdminNettestFields = dynamic(() => import("./AdminNettestFields"))
const ButtonSpinner = dynamic(() => import("components/ButtonSpinner"))

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
  is_background_run_enabled_default: boolean
  is_manual_run_enabled_default: boolean
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
    expiration_date: string
    nettests: Nettest[]
  }>
}

const validationSchema = Yup.object({
  ooniRunLink: Yup.array()
    .required()
    .min(0)
    .of(
      Yup.object({
        name: Yup.string()
          .required("Required field.")
          .min(2, "Must be at least 2 characters.")
          .max(50, "Should be shorter that 50 characters."),
        short_description: Yup.string()
          .required("Required field.")
          .min(2, "Must be at least 2 characters.")
          .max(200, "Should be shorter that 50 characters."),
        description: Yup.string()
          .required("Required field.")
          .min(2, "Must be at least 2 characters."),
        icon: Yup.string().defined(),
        color: Yup.string().defined(),
        author: Yup.string().defined(),
        include_author: Yup.boolean().defined(),
        expiration_date: Yup.string().required("Required field."),
        nettests: Yup.array()
          .required()
          .of(
            Yup.object({
              test_name: Yup.string().required("Required field."),
              inputs: Yup.array()
                .required()
                .min(0)
                .of(
                  Yup.string()
                    .defined()
                    .test(
                      "is-valid-url",
                      'should be a valid URL format e.g "https://ooni.org/post/"',
                      (value) => {
                        if (value == null) return true
                        try {
                          const url = new URL(value)
                          if (
                            url.protocol !== "http:" &&
                            url.protocol !== "https:"
                          ) {
                            return false
                          }
                          return true
                        } catch {
                          return false
                        }
                      },
                    ),
                ),
              options: Yup.array()
                .required()
                .min(0)
                .of(Yup.object({ key: Yup.string(), value: Yup.string() })),
              backend_options: Yup.array()
                .required()
                .min(0)
                .of(Yup.object({ key: Yup.string(), value: Yup.string() })),
              is_background_run_enabled_default: Yup.boolean().defined(),
              is_manual_run_enabled_default: Yup.boolean().defined(),
            }),
          ),
      }),
    ),
})

type TestListFormProps = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onSubmit: any
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
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const formMethods = useForm<TestList>({
    mode: "onTouched",
    defaultValues: { ooniRunLink: [defaultValues] },
    resolver: yupResolver(validationSchema),
  })
  const { control, formState, handleSubmit, setValue, watch, getValues } =
    formMethods
  const iconValue = watch("ooniRunLink.0.icon") as keyof typeof icons

  const { errors, isSubmitting } = formState

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "ooniRunLink", // unique name for your Field Array
  })

  // const { trigger, isMutating } = useSWRMutation(
  //   linkId && apiEndpoints.ARCHIVE_RUN_LINK.replace(":oonirun_id", linkId),
  //   postFetcher,
  //   {
  //     onSuccess: () => {
  //       push(`/v2/${linkId}`)
  //     },
  //   },
  // )

  const [showDatePicker, setShowDatePicker] = useState(false)
  const handleRangeSelect = (date: Date | undefined) => {
    if (date) {
      setValue("ooniRunLink.0.expiration_date", format(date, "y-MM-dd"))
      setShowDatePicker(false)
    }
  }

  return (
    <Flex flexDirection="column">
      <datalist id="url-prefixes">
        <option value="https://" />
        <option value="http://" />
      </datalist>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDirection="column" my={5}>
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
                  {iconValue && (
                    <Box fontSize={3}>
                      <DescriptorIcon icon={iconValue} />
                    </Box>
                  )}
                  <IconModal setValue={setValue} iconValue={iconValue} />
                </StyledInputWrapper>
                <StyledInputWrapper>
                  <StyledLabel mb={1}>Color</StyledLabel>
                  <Controller
                    render={({ field }) => (
                      <Compact
                        {...field}
                        color={field.value}
                        style={{
                          border: "1px solid gray",
                        }}
                        onChange={(color) => {
                          field.onChange(color.hex)
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
                        error={
                          errors?.ooniRunLink?.[index]?.short_description
                            ?.message
                        }
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
                      <Textarea
                        {...field}
                        label="Description"
                        placeholder=""
                        minHeight="78px"
                        error={
                          errors?.ooniRunLink?.[index]?.description?.message
                        }
                      />
                    )}
                    name={`ooniRunLink.${index}.description`}
                    control={control}
                  />
                  <IntlFields name={`ooniRunLink.${index}.description_intl`} />
                </StyledInputWrapper>
                {isClient && (
                  <StyledInputWrapper>
                    <Controller
                      render={({ field }) => (
                        <Input
                          {...field}
                          disabled
                          bg="gray3"
                          label="Author's Email"
                        />
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
                )}

                <StyledInputWrapper>
                  <Controller
                    name={`ooniRunLink.${index}.expiration_date`}
                    control={control}
                    render={({ field }) => (
                      <>
                        <Input
                          {...field}
                          label="Expiration Date"
                          error={
                            errors?.ooniRunLink?.[index]?.expiration_date
                              ?.message
                          }
                          placeholder="YYYY-MM-DD"
                          onFocus={() => setShowDatePicker(true)}
                          onKeyDown={() => setShowDatePicker(false)}
                        />
                        {showDatePicker && (
                          <DatePicker
                            handleRangeSelect={handleRangeSelect}
                            initialDate={getValues(
                              `ooniRunLink.${index}.expiration_date`,
                            )}
                            close={() => setShowDatePicker(false)}
                          />
                        )}
                      </>
                    )}
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
