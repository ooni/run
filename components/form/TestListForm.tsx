import { yupResolver } from '@hookform/resolvers/yup'
import Compact from '@uiw/react-color-compact'
import { format } from 'date-fns'
import { Input } from 'ooni-components'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import * as Yup from 'yup'

import DescriptorIcon from 'components/DescriptorIcon'
import dynamic from 'next/dynamic'
import { Textarea } from 'ooni-components'
import { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { twMerge } from 'tailwind-merge'
import type { icons } from 'utils/icons'
import DatePicker from './DatePicker'

const IconModal = dynamic(() => import('./IconModal'))
const IntlFields = dynamic(() => import('./IntlFields'))
const NettestFields = dynamic(() => import('./NettestFields'))
const AdminNettestFields = dynamic(() => import('./AdminNettestFields'))
// const ButtonSpinner = dynamic(() => import("components/ButtonSpinner"))

export type FieldsPropTypes = {
  name: string
}

export const StyledLabel = ({ className = '', ...props }) => (
  <label className={twMerge('text-base font-semibold', className)} {...props} />
)

export const StyledInputWrapper = ({ ...props }) => (
  <div {...props} className="mb-8" />
)

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
  .required('TestListForm.Validation.Required')
  .min(2, 'TestListForm.Validation.Min2')
  .max(50, 'TestListForm.Validation.Max50')
const minIntlValidation = Yup.string()
  .required('TestListForm.Validation.Required')
  .min(2, 'TestListForm.Validation.Min2')

const validationSchema = Yup.object({
  name: minmaxIntlValidation,
  name_intl: Yup.array().of(
    Yup.object({
      key: Yup.string().required('TestListForm.Validation.Required'),
      value: minmaxIntlValidation,
    }),
  ),
  short_description: minmaxIntlValidation,
  short_description_intl: Yup.array().of(
    Yup.object({
      key: Yup.string().required('TestListForm.Validation.Required'),
      value: minmaxIntlValidation,
    }),
  ),
  description: minIntlValidation,
  description_intl: Yup.array().of(
    Yup.object({
      key: Yup.string().required('TestListForm.Validation.Required'),
      value: minIntlValidation,
    }),
  ),
  icon: Yup.string().defined(),
  color: Yup.string().defined(),
  author: Yup.string().defined(),
  expiration_date: Yup.string()
    .required('TestListForm.Validation.Required')
    .test(
      'is-future',
      'TestListForm.Validation.FutureDate',
      (value) => new Date(value) > new Date(),
    ),
  nettests: Yup.array()
    .required()
    .of(
      Yup.object({
        test_name: Yup.string().required('TestListForm.Validation.Required'),
        inputs: Yup.array()
          .required()
          .when('test_name', {
            is: 'web_connectivity',
            // biome-ignore lint/suspicious/noThenProperty: <explanation>
            then: (schema) => schema.min(1, 'TestListForm.Validation.Min1Url'),
            otherwise: (schema) => schema.min(0),
          })
          .of(
            Yup.string()
              .defined()
              .test('is-valid-url', 'Error.UrlFormat', (value) => {
                if (value == null) return true
                try {
                  const url = new URL(value)
                  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                    return false
                  }
                  return true
                } catch {
                  return false
                }
              }),
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
  const intl = useIntl()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const formMethods = useForm<TestList>({
    mode: 'onSubmit',
    defaultValues,
    resolver: yupResolver(validationSchema),
  })
  const { control, formState, handleSubmit, setValue, watch, getValues } =
    formMethods
  const iconValue = watch('icon') as keyof typeof icons

  const { isSubmitting } = formState

  const [showDatePicker, setShowDatePicker] = useState(false)
  const handleRangeSelect = (date: Date | undefined) => {
    if (date) {
      setValue('expiration_date', format(date, 'y-MM-dd'))
      setShowDatePicker(false)
    }
  }

  return (
    <div className="flex flex-col">
      <datalist id="url-prefixes">
        <option value="https://" />
        <option value="http://" />
      </datalist>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="flex flex-col my-16">
            <div>
              <StyledInputWrapper>
                <Controller
                  render={({ field }) => (
                    <Input
                      type="hidden"
                      {...field}
                      label={intl.formatMessage({
                        id: 'TestListForm.Label.Icon',
                      })}
                    />
                  )}
                  name="icon"
                  control={control}
                />
                {iconValue && (
                  <div className="text-2xl">
                    <DescriptorIcon icon={iconValue} />
                  </div>
                )}
                <IconModal setValue={setValue} iconValue={iconValue} />
              </StyledInputWrapper>
              <StyledInputWrapper>
                <StyledLabel className="mb-1">
                  {intl.formatMessage({ id: 'TestListForm.Label.Color' })}
                </StyledLabel>
                <Controller
                  render={({ field }) => (
                    <Compact
                      {...field}
                      color={field.value}
                      style={{
                        border: '1px solid gray',
                        width: '247px',
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
                      label={`${intl.formatMessage({ id: 'TestListForm.Label.TestListName' })} *`}
                      placeholder=""
                      error={
                        !!fieldState?.error?.message &&
                        intl.formatMessage({ id: fieldState?.error?.message })
                      }
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
                      label={`${intl.formatMessage({ id: 'TestListForm.Label.ShortDescription' })} *`}
                      placeholder=""
                      error={
                        !!fieldState?.error?.message &&
                        intl.formatMessage({ id: fieldState?.error?.message })
                      }
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
                      label={`${intl.formatMessage({ id: 'TestListForm.Label.Description' })} *`}
                      placeholder=""
                      minHeight="78px"
                      error={
                        !!fieldState?.error?.message &&
                        intl.formatMessage({ id: fieldState?.error?.message })
                      }
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
                        label={`${intl.formatMessage({ id: 'TestListForm.Label.Email' })} *`}
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
                        label={`${intl.formatMessage({ id: 'TestListForm.Label.ExpirationDate' })} *`}
                        error={
                          !!fieldState?.error?.message &&
                          intl.formatMessage({ id: fieldState?.error?.message })
                        }
                        placeholder="YYYY-MM-DD"
                        onFocus={() => setShowDatePicker(true)}
                        onKeyDown={() => setShowDatePicker(false)}
                      />
                      {showDatePicker && (
                        <DatePicker
                          handleRangeSelect={handleRangeSelect}
                          initialDate={getValues('expiration_date')}
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
            </div>
            <div className="flex justify-end mb-8">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                <span className="flex gap-1 items-center">
                  {linkId ? (
                    <FormattedMessage id="Button.Update" />
                  ) : (
                    <FormattedMessage id="Button.Generate" />
                  )}{' '}
                  <FaCheck />
                </span>
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default TestListForm
