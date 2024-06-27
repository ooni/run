import { yupResolver } from "@hookform/resolvers/yup"
import Compact from "@uiw/react-color-compact"
import { format } from "date-fns"
import { Box, Button, Flex, Input, Text } from "ooni-components"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"
import * as Yup from "yup"

import DescriptorIcon from "components/DescriptorIcon"
import dynamic from "next/dynamic"
import { Textarea } from "ooni-components"
import { useEffect, useState } from "react"
import { FaCheck } from "react-icons/fa6"
import type { icons } from "utils/icons"
import DatePicker from "./DatePicker"
import V1MigrationField from "./V1MigrationField"

const IconModal = dynamic(() => import("./IconModal"))
const IntlFields = dynamic(() => import("./IntlFields"))
const NettestFields = dynamic(() => import("./NettestFields"))
const AdminNettestFields = dynamic(() => import("./AdminNettestFields"))
const ButtonSpinner = dynamic(() => import("components/ButtonSpinner"))

export type FieldsPropTypes = {
  name: string
}

export const StyledLabel = styled(Text).attrs({
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
  name: string
  name_intl?: { key: string; value: string }[]
  short_description: string
  short_description_intl?: { key: string; value: string }[]
  description: string
  description_intl?: { key: string; value: string }[]
  icon: string
  color: string
  author: string
  expiration_date: string
  nettests: Nettest[]
}

const minmaxIntlValidation = Yup.string()
  .required("Required field.")
  .min(2, "Must be at least 2 characters.")
  .max(50, "Should be shorter that 50 characters.")
const minIntlValidation = Yup.string()
  .required("Required field.")
  .min(2, "Must be at least 2 characters.")

const validationSchema = Yup.object({
  name: minmaxIntlValidation,
  name_intl: Yup.array().of(
    Yup.object({
      key: Yup.string().required("Required field."),
      value: minmaxIntlValidation,
    }),
  ),
  short_description: minmaxIntlValidation,
  short_description_intl: Yup.array().of(
    Yup.object({
      key: Yup.string().required("Required field."),
      value: minmaxIntlValidation,
    }),
  ),
  description: minIntlValidation,
  description_intl: Yup.array().of(
    Yup.object({
      key: Yup.string().required("Required field."),
      value: minIntlValidation,
    }),
  ),
  icon: Yup.string().defined(),
  color: Yup.string().defined(),
  author: Yup.string().defined(),
  expiration_date: Yup.string()
    .required("Required field.")
    .test(
      "is-future",
      "Should be in the future.",
      (value) => new Date(value) > new Date(),
    ),
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
                'Should be a valid URL format e.g "https://ooni.org/post/"',
                (value) => {
                  if (value == null) return true
                  try {
                    const url = new URL(value)
                    if (url.protocol !== "http:" && url.protocol !== "https:") {
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
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(validationSchema),
  })
  const { control, formState, handleSubmit, setValue, watch, getValues } =
    formMethods
  const iconValue = watch("icon") as keyof typeof icons

  const { isSubmitting } = formState

  const [showDatePicker, setShowDatePicker] = useState(false)
  const handleRangeSelect = (date: Date | undefined) => {
    if (date) {
      setValue("expiration_date", format(date, "y-MM-dd"))
      setShowDatePicker(false)
    }
  }

  const [showV1Modal, setShowV1Modal] = useState(false)

  return (
    <Flex flexDirection="column">
      <Box mt={4}>
        <Button variant="link" onClick={() => setShowV1Modal(true)}>
          I'd like to migrate URLs from old OONI Run link
        </Button>
        <V1MigrationField
          show={showV1Modal}
          onClose={() => setShowV1Modal(false)}
          nettests={getValues("nettests")}
          setValue={setValue}
        />
      </Box>
      <datalist id="url-prefixes">
        <option value="https://" />
        <option value="http://" />
      </datalist>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Flex flexDirection="column" my={5}>
            <Box>
              <StyledInputWrapper>
                <Controller
                  render={({ field }) => (
                    <Input type="hidden" {...field} label="Icon" />
                  )}
                  name="icon"
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
                  name="color"
                  control={control}
                />
              </StyledInputWrapper>
              <StyledInputWrapper>
                <Controller
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      label="Test list name *"
                      placeholder=""
                      error={fieldState?.error?.message}
                    />
                  )}
                  name="name"
                  control={control}
                />
                <IntlFields name="name_intl" />
              </StyledInputWrapper>
              <StyledInputWrapper>
                <Controller
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      label="Short description *"
                      placeholder=""
                      error={fieldState?.error?.message}
                    />
                  )}
                  name="short_description"
                  control={control}
                />
                <IntlFields name="short_description_intl" />
              </StyledInputWrapper>
              <StyledInputWrapper>
                <Controller
                  render={({ field, fieldState }) => (
                    <Textarea
                      {...field}
                      label="Description *"
                      placeholder=""
                      minHeight="78px"
                      error={fieldState?.error?.message}
                    />
                  )}
                  name="description"
                  control={control}
                />
                <IntlFields name="description_intl" />
              </StyledInputWrapper>
              {isClient && (
                <StyledInputWrapper>
                  <Controller
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled
                        bg="gray3"
                        label="Author's Email *"
                      />
                    )}
                    name="author"
                    control={control}
                  />
                </StyledInputWrapper>
              )}

              <StyledInputWrapper>
                <Controller
                  name="expiration_date"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        label="Expiration Date *"
                        error={fieldState?.error?.message}
                        placeholder="YYYY-MM-DD"
                        onFocus={() => setShowDatePicker(true)}
                        onKeyDown={() => setShowDatePicker(false)}
                      />
                      {showDatePicker && (
                        <DatePicker
                          handleRangeSelect={handleRangeSelect}
                          initialDate={getValues("expiration_date")}
                          close={() => setShowDatePicker(false)}
                        />
                      )}
                    </>
                  )}
                />
              </StyledInputWrapper>
              {isAdmin ? (
                <AdminNettestFields name="nettests" />
              ) : (
                <NettestFields name="nettests" />
              )}
            </Box>
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
