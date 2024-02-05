import { registerUser } from "lib/api"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { Box, Button, Flex, Input } from "ooni-components"
import { useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { FormattedMessage } from "react-intl"

const ButtonSpinner = dynamic(() => import("components/ButtonSpinner"))

type LoginFormProps = {
  onLogin: () => void
  redirectTo?: string
}

export const LoginForm = ({ onLogin, redirectTo }: LoginFormProps) => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setError] = useState(null)

  const { handleSubmit, control, formState, reset } = useForm({
    mode: "onTouched",
    defaultValues: { email_address: "" },
  })

  const { errors, isValid, isDirty } = formState

  const onSubmit = useCallback(
    (data: { email_address: string }) => {
      console.log("data", data)
      const { email_address } = data
      const registerApi = async (email_address: string) => {
        try {
          await registerUser(email_address, redirectTo)
          onLogin()
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        } catch (e: any) {
          setError(e?.message)
          // Reset form to mark `isDirty` as false
          reset({}, { keepValues: true })
        } finally {
          setSubmitting(false)
        }
      }
      setSubmitting(true)
      registerApi(email_address)
    },
    [onLogin, reset, redirectTo],
  )

  useEffect(() => {
    // Remove previous errors when form becomes dirty again
    if (isDirty) {
      setError(null)
    }
  }, [isDirty])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection={["column"]}>
        <Controller
          render={({ field }) => (
            <Input
              placeholder="Email *"
              error={errors?.email_address?.message}
              {...field}
            />
          )}
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Not valid email address",
            },
            required: true,
          }}
          name="email_address"
          control={control}
        />
        {loginError && <Box mt={1}>{loginError}</Box>}
        <Box mt={3} alignSelf="center">
          <Button
            loading={submitting}
            disabled={submitting || !isValid}
            spinner={<ButtonSpinner />}
            type="submit"
          >
            <FormattedMessage id="Login.Button" />
          </Button>
        </Box>
      </Flex>
    </form>
  )
}

export default LoginForm
