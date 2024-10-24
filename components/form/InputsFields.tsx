import { Input } from 'ooni-components'
import { useCallback } from 'react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'
import { FaRegTrashCan } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import type { FieldsPropTypes } from './TestListForm'

const InputsFields = ({ name }: FieldsPropTypes) => {
  const intl = useIntl()
  const { trigger, control } = useFormContext()
  const { fields, append, remove, insert } = useFieldArray({
    name,
    control,
  })

  const onKeyPress = useCallback(
    (e: KeyboardEvent, index: number) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        append('', {
          shouldFocus: true,
          focusName: `${name}[${index + 1}]`,
        })
      }
    },
    [append, name],
  )

  const handlePaste = useCallback(
    (
      e: ClipboardEvent,
      index: number,
      onChange: (event: ClipboardEvent) => void,
    ) => {
      // block the usual paste action
      e.preventDefault()

      const pastedText = e.clipboardData?.getData('Text')
      if (pastedText) {
        const newEntries = [
          ...new Set(
            pastedText
              .replace(/\r?\n|\r|\t/g, ' ')
              .split(' ')
              .filter((line: string) => !!line.length),
          ),
        ]

        // Place first pasted entry into event and trigger onChange
        // This updates the field being pasted into with the first entry
        const eventTarget = e.target as HTMLInputElement
        eventTarget.value = newEntries[0]
        onChange(e)

        // Insert fields into the form using the rest of the entries
        insert(index + 1, newEntries.slice(1))

        // Trigger validation to show any errors in the new entries
        trigger()
      }
    },
    [insert, trigger],
  )

  return (
    <>
      {fields.map((item, index) => (
        <div className="mt-4" key={item.id}>
          <div className="flex items-center">
            <div className="w-full">
              <Controller
                key={`input-${item.id}`}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    placeholder="https://twitter.com/"
                    list="url-prefixes"
                    onKeyPress={(e: KeyboardEvent) => onKeyPress(e, index)}
                    onPaste={(e: ClipboardEvent) =>
                      handlePaste(e, index, field.onChange)
                    }
                    error={
                      !!fieldState?.error?.message &&
                      intl.formatMessage({ id: fieldState?.error?.message })
                    }
                  />
                )}
                name={`${name}[${index}]`}
                control={control}
              />
            </div>
            <div className="ml-2">
              <button type="button" onClick={() => remove(index)}>
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
          append('', { shouldFocus: true })
        }}
      >
        {intl.formatMessage({ id: 'TestListForm.Inputs.AddInput' })} +
      </button>
      <Controller
        render={({ fieldState }) => (
          <div className="text-red-700 text-xs mt-1">
            {!!fieldState?.error?.message &&
              intl.formatMessage({ id: fieldState?.error?.message })}
          </div>
        )}
        name={name}
        control={control}
      />
    </>
  )
}

export default InputsFields
