import { Box, Button, Checkbox, Heading, Input } from "ooni-components"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { FaPlus, FaRegTrashCan } from "react-icons/fa6"
import { useIntl } from "react-intl"
import InputsFields from "./InputsFields"
import OptionsFields from "./OptionsFields"
import {
  StyledInputWrapper,
  StyledLabel,
  type FieldsPropTypes,
} from "./TestListForm"

const AdminNettestFields = ({ name }: FieldsPropTypes) => {
  const intl = useIntl()
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name, control })
  return (
    <>
      <Heading h={2} fontWeight={300} mt={4}>
        {intl.formatMessage({ id: "TestListForm.AdminNettests.Tests" })}{" "}
      </Heading>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            <Box
              mb={4}
              sx={
                fields.length > 1
                  ? { borderBottom: "1px solid", borderColor: "gray4", pb: 4 }
                  : {}
              }
            >
              <StyledInputWrapper>
                <Controller
                  key={`nettests-test_name-${item.id}`}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      label={`${index + 1}. ${intl.formatMessage({ id: "Home.Heading.TestName" })}`}
                      error={fieldState?.error?.message}
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
                    id: "TestListForm.AdminNettests.Inputs",
                  })}
                </StyledLabel>
                <InputsFields name={`${name}[${index}].inputs`} />
              </StyledInputWrapper>
              <StyledInputWrapper>
                <StyledLabel>
                  {intl.formatMessage({
                    id: "TestListForm.AdminNettests.Options",
                  })}
                </StyledLabel>
                <OptionsFields name={`${name}[${index}].options`} />
              </StyledInputWrapper>
              <StyledInputWrapper>
                <StyledLabel>
                  {intl.formatMessage({
                    id: "TestListForm.AdminNettests.BackendOptions",
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
                        id: "TestListForm.AdminNettests.EnableBackgroundRun",
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
                        id: "TestListForm.AdminNettests.EnableManualRun",
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
                <Box textAlign="end">
                  <Button
                    hollow
                    onClick={() => remove(index)}
                    endIcon={<FaRegTrashCan size={18} />}
                  >
                    {intl.formatMessage({
                      id: "TestListForm.AdminNettests.DeleteTest",
                    })}
                  </Button>
                </Box>
              )}
            </Box>
          </li>
        ))}
      </ul>
      <Button
        hollow
        mr="auto"
        mb={4}
        type="button"
        onClick={() => {
          append({
            test_name: "",
            options: [],
            backend_options: [],
            is_background_run_enabled_default: false,
            is_manual_run_enabled_default: false,
          })
        }}
        endIcon={<FaPlus />}
      >
        {intl.formatMessage({ id: "TestListForm.AdminNettests.AddTest" })}
      </Button>
    </>
  )
}

export default AdminNettestFields
