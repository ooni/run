import { Input, Textarea, Select } from 'ooni-components'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { FaRegTrashCan } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import supportedLanguages from '../../utils/supportedLanguages'
import type { FieldsPropTypes } from './TestListForm'

const langOptions = supportedLanguages.map((lang) => ({
  key: lang,
  name: new Intl.DisplayNames(['en'], { type: 'language' }).of(
    lang.replace('_', '-'),
  ),
}))

const IntlFields = ({ name, inputType = 'text' }: FieldsPropTypes & { inputType?: 'text' | 'textarea' }) => {
  const intl = useIntl()
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    name,
    control,
  })

  return (
    <>
      {fields.map((item, index) => (
        <div className="mt-4" key={item.id}>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-4/12 mr-0 md:mr-2 pr-7 md:pr-0">
              <Controller
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      label={intl.formatMessage({
                        id: 'TestListForm.Intl.Language',
                      })}
                      width={1}
                      error={
                        !!fieldState?.error?.message &&
                        intl.formatMessage({ id: fieldState?.error?.message })
                      }
                    >
                      <option value="" />
                      {langOptions.map(({ key, name }) => (
                        <option key={key} value={key}>
                          {name}
                        </option>
                      ))}
                    </Select>
                    {/* TODO: fix this in ooni-components and remove from here */}
                    {fieldState?.error?.message && (
                      <div className="text-red-700 text-xs mt-[2px]">
                        {intl.formatMessage({ id: fieldState?.error?.message })}
                      </div>
                    )}
                  </>
                )}
                name={`${name}[${index}].key`}
                control={control}
              />
            </div>
            <div className="w-full md:w-8/12">
              <div className="flex flex-row mt-2 md:mt-0 items-end">
                <div className="w-full">
                  <Controller
                  render={({ field, fieldState }) => {
                    const Component = inputType === 'textarea' ? Textarea : Input
                    return (
                    <Component
                      label={intl.formatMessage({
                      id: 'TestListForm.Intl.Translation',
                      })}
                      {...field}
                      error={
                      !!fieldState?.error?.message &&
                      intl.formatMessage({ id: fieldState?.error?.message })
                      }
                    />
                    )
                  }}
                  name={`${name}[${index}].value`}
                  control={control}
                  />
                </div>
                <button
                  type="button"
                  className="mb-3 ml-2"
                  onClick={() => remove(index)}
                >
                  <FaRegTrashCan size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        className="mt-2 appearance-none text-blue-500 hover:text-blue-800"
        type="button"
        onClick={() => {
          append({ key: '', value: '' })
        }}
      >
        {intl.formatMessage({ id: 'TestListForm.Intl.AddTranslation' })} +
      </button>
    </>
  )
}

export default IntlFields
