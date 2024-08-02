import { Heading, Input } from "ooni-components"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import InputsFields from "./InputsFields"
import {
  StyledInputWrapper,
  StyledLabel,
  type FieldsPropTypes,
} from "./TestListForm"

const NettestFields = ({ name }: FieldsPropTypes) => {
  const intl = useIntl()
  const { control } = useFormContext()
  const { fields } = useFieldArray({ name, control })
  return (
    <>
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
              <StyledLabel>
                {intl.formatMessage({ id: "TestListForm.NettestFields.Urls" })}
              </StyledLabel>
              <InputsFields name={`${name}[${index}].inputs`} />
            </StyledInputWrapper>
          </li>
        ))}
      </ul>
    </>
  )
}

export default NettestFields
