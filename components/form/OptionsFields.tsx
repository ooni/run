import { Input } from 'ooni-components'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { FaRegTrashCan } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import type { FieldsPropTypes } from './TestListForm'

const OptionsFields = ({ name }: FieldsPropTypes) => {
  const intl = useIntl()
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
    <>
      {fields.map((item, index) => (
        <div className="mt-4" key={item.id}>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-4/12 mr-0 md:mr-2 pr-7 md:pr-0">
              <Controller
                key={`${name}[${index}]-${item.id}-key`}
                render={({ field }) => (
                  <Input
                    {...field}
                    label={intl.formatMessage({
                      id: 'TestListForm.OptionsFields.Key',
                    })}
                  />
                )}
                name={`${name}[${index}].key`}
                control={control}
              />
            </div>
            <div className="flex w-full md:w-8/12 items-end">
              <div className="w-full mt-2 md:mt-0">
                <Controller
                  key={`${name}[${index}]-${item.id}-value`}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={intl.formatMessage({
                        id: 'TestListForm.OptionsFields.Value',
                      })}
                    />
                  )}
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
      ))}
      <button
        className="mt-2 appearance-none text-blue-500 hover:text-blue-800 block"
        type="button"
        onClick={() => {
          append({ key: '', value: '' })
        }}
      >
        {intl.formatMessage({
          id: 'TestListForm.OptionsFields.AddOption',
        })}{' '}
        +
      </button>
    </>
  )
}

export default OptionsFields
