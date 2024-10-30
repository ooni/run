import { Checkbox, Input } from 'ooni-components'
import { useState } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { FaPlus, FaRegTrashCan } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import InputsFields from './InputsFields'
import OptionsFields from './OptionsFields'
import {
  StyledInputWrapper,
  StyledLabel,
  type FieldsPropTypes,
} from './TestListForm'
import V1MigrationField from './V1MigrationField'

const AdminNettestFields = ({ name }: FieldsPropTypes) => {
  const intl = useIntl()
  const { control, getValues, setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name, control })
  const [showV1Modal, setShowV1Modal] = useState(false)

  return (
    <>
      <h2 className="font-light mt-8 mb-2">
        {intl.formatMessage({ id: 'TestListForm.AdminNettests.Tests' })}{' '}
      </h2>
      {fields.map((item, index) => (
        <div
          key={item.id}
          className={`mb-8 ${fields.length > 1 && 'border-b border-gray-400 pb-8'}`}
        >
          <StyledInputWrapper>
            <Controller
              key={`nettests-test_name-${item.id}`}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label={`${index + 1}. ${intl.formatMessage({ id: 'Home.Heading.TestName' })}`}
                  error={
                    !!fieldState?.error?.message &&
                    intl.formatMessage({ id: fieldState?.error?.message })
                  }
                  placeholder=""
                />
              )}
              name={`${name}[${index}].test_name`}
              control={control}
            />
          </StyledInputWrapper>
          <StyledInputWrapper>
            <StyledLabel>
              {intl.formatMessage({
                id: 'TestListForm.NettestFields.Urls',
              })}
            </StyledLabel>
            <InputsFields name={`${name}[${index}].inputs`} />
            <div className="mt-4">
              <button
                className="appearance-none cursor-pointer text-blue-500 hover:text-blue-900 text-start"
                type="button"
                onClick={() => setShowV1Modal(true)}
              >
                {intl.formatMessage({ id: 'TestListForm.MigrationModalLink' })}
              </button>
              <V1MigrationField
                show={showV1Modal}
                onClose={() => setShowV1Modal(false)}
                nettests={getValues('nettests')}
                setValue={setValue}
              />
            </div>
          </StyledInputWrapper>
          <StyledInputWrapper>
            <StyledLabel>
              {intl.formatMessage({
                id: 'TestListForm.AdminNettests.Options',
              })}
            </StyledLabel>
            <OptionsFields name={`${name}[${index}].options`} />
          </StyledInputWrapper>
          <StyledInputWrapper>
            <StyledLabel>
              {intl.formatMessage({
                id: 'TestListForm.AdminNettests.BackendOptions',
              })}
            </StyledLabel>
            <OptionsFields name={`${name}[${index}].backend_options`} />
          </StyledInputWrapper>
          <StyledInputWrapper>
            <Controller
              key={`nettests-is_background_run_enabled_default-${item.id}`}
              render={({ field }) => (
                <Checkbox
                  label={intl.formatMessage({
                    id: 'TestListForm.AdminNettests.EnableBackgroundRun',
                  })}
                  {...field}
                  id="backgroundRun"
                  checked={field.value}
                />
              )}
              name={`${name}[${index}].is_background_run_enabled_default`}
              control={control}
            />
          </StyledInputWrapper>
          <StyledInputWrapper>
            <Controller
              key={`nettests-is_manual_run_enabled_default-${item.id}`}
              render={({ field }) => (
                <Checkbox
                  label={intl.formatMessage({
                    id: 'TestListForm.AdminNettests.EnableManualRun',
                  })}
                  {...field}
                  id="manualRun"
                  checked={field.value}
                />
              )}
              name={`${name}[${index}].is_manual_run_enabled_default`}
              control={control}
            />
          </StyledInputWrapper>
          {fields.length > 1 && (
            <div className="flex justify-end">
              <button
                type="button"
                className="btn btn-primary-hollow"
                onClick={() => remove(index)}
              >
                <span className="flex gap-1 items-center">
                  {intl.formatMessage({
                    id: 'TestListForm.AdminNettests.DeleteTest',
                  })}{' '}
                  <FaRegTrashCan size={18} />
                </span>
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        className="btn btn-primary-hollow mr-auto mb-8"
        type="button"
        onClick={() => {
          append({
            test_name: '',
            options: [],
            backend_options: [],
            is_background_run_enabled_default: false,
            is_manual_run_enabled_default: false,
          })
        }}
      >
        <span className="flex gap-1 items-center">
          {intl.formatMessage({ id: 'TestListForm.AdminNettests.AddTest' })}{' '}
          <FaPlus />
        </span>
      </button>
    </>
  )
}

export default AdminNettestFields
