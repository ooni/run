import { Box, Button, Input } from "ooni-components"
import { useState } from "react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import InputsFields from "./InputsFields"
import {
  StyledInputWrapper,
  StyledLabel,
  type FieldsPropTypes,
} from "./TestListForm"
import V1MigrationField from "./V1MigrationField"

const NettestFields = ({ name }: FieldsPropTypes) => {
  const intl = useIntl()
  const { control, getValues, setValue } = useFormContext()
  const { fields } = useFieldArray({ name, control })
  const [showV1Modal, setShowV1Modal] = useState(false)

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
              <Box mt={3}>
                <Button type="button" variant="link" onClick={() => setShowV1Modal(true)}>
                  {intl.formatMessage({ id: "TestListForm.MigrationModalLink" })}
                </Button>
                <V1MigrationField
                  show={showV1Modal}
                  onClose={() => setShowV1Modal(false)}
                  nettests={getValues("nettests")}
                  setValue={setValue}
                />
              </Box>
            </StyledInputWrapper>
          </li>
        ))}
      </ul>
    </>
  )
}

export default NettestFields
