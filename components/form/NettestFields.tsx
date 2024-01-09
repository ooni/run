import { Heading, Input } from "ooni-components"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import InputsFields from "./InputsFields"
import {
  FieldsPropTypes,
  StyledInputWrapper,
  StyledLabel,
} from "./TestListForm"

const NettestFields = ({ name }: FieldsPropTypes) => {
  const { control } = useFormContext()
  const { fields } = useFieldArray({ name, control })
  return (
    <>
      <Heading h={4} fontWeight={300} mt={4}>
        URLs
      </Heading>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            {index > 0 && <hr />}
            <Controller
              key={`nettests-test_name-${item.id}`}
              render={({ field }) => {
                return (
                  <Input type="hidden" {...field} value="web_connectivity" />
                )
              }}
              name={`${name}[${index}].test_name`}
              control={control}
            />
            <StyledInputWrapper>
              <StyledLabel>URLs</StyledLabel>
              <InputsFields name={`${name}[${index}].inputs`} />
            </StyledInputWrapper>
          </li>
        ))}
      </ul>
    </>
  )
}

export default NettestFields
