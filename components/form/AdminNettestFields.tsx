import { useFieldArray, Controller, useFormContext } from 'react-hook-form'
import { Input, Button, Checkbox } from 'ooni-components'
import {
  FieldsPropTypes,
  StyledInputWrapper,
  StyledLabel,
} from './TestListForm'
import { MdDelete } from 'react-icons/md'
import OptionsFields from './OptionsFields'
import BackendOptionsFields from './BackendOptionsFields'
import InputsFields from './InputsFields'
import { Heading } from 'ooni-components'

const AdminNettestFields = ({ name }: FieldsPropTypes) => {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
    <>
      <Heading h={4} fontWeight={300} mt={4}>
        Tests
      </Heading>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            {index > 0 && <hr />}
            <StyledInputWrapper>
              <Controller
                key={`nettests-test_name-${item.id}`}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label="Nettest name"
                    error={fieldState?.error?.message}
                    placeholder=""
                  />
                )}
                name={`${name}[${index}].test_name`}
                control={control}
              />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <StyledLabel>Inputs</StyledLabel>
              <InputsFields name={`${name}[${index}].inputs`} />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <StyledLabel>Options</StyledLabel>
              <OptionsFields name={`${name}[${index}].options`} />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <StyledLabel>Backend options</StyledLabel>
              <BackendOptionsFields
                name={`${name}[${index}].backend_options`}
              />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Controller
                key={`nettests-is_background_run_enabled-${item.id}`}
                render={({ field }) => (
                  <Checkbox
                    label="Enable background run"
                    {...field}
                    id="backgroundRun"
                    checked={field.value}
                  />
                )}
                name={`${name}[${index}].is_background_run_enabled`}
                control={control}
              />
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Controller
                key={`nettests-is_manual_run_enabled-${item.id}`}
                render={({ field }) => (
                  <Checkbox
                    label="Enable manual run"
                    {...field}
                    id="manualRun"
                    checked={field.value}
                  />
                )}
                name={`${name}[${index}].is_manual_run_enabled`}
                control={control}
              />
            </StyledInputWrapper>
            {fields.length > 1 && (
              <Button
                variant="unstyled"
                type="button"
                onClick={() => remove(index)}
              >
                <MdDelete size={30} />
              </Button>
            )}
          </li>
        ))}
      </ul>
      <Button
        hollow
        mr="auto"
        my={3}
        type="button"
        onClick={() => {
          append({ test_name: '', options: [], backend_options: [], is_background_run_enabled: false, is_manual_run_enabled: false })
        }}
      >
        + Add nettest
      </Button>
    </>
  )
}

export default AdminNettestFields
