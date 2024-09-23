import { registerUser } from 'lib/api'
import { Input } from 'ooni-components'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'

type LoginFormProps = {
  onLogin: () => void
  redirectTo?: string
}

export const LoginForm = ({ onLogin, redirectTo }: LoginFormProps) => {
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setError] = useState(null)

  const { handleSubmit, control, formState, reset } = useForm({
    mode: 'onTouched',
    defaultValues: { email_address: '' },
  })

  const { errors, isValid, isDirty } = formState

  const onSubmit = useCallback(
    (data: { email_address: string }) => {
      console.log('data', data)
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
      <div className="flex flex-col">
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
              message: 'Not valid email address',
            },
            required: true,
          }}
          name="email_address"
          control={control}
        />
        {loginError && (
          <div className="mt-1 text-red-800 text-sm">{loginError}</div>
        )}
        <div className="mt-3 self-center">
          <button
            className="btn btn-primary"
            disabled={submitting || !isValid}
            type="submit"
          >
            <FormattedMessage id="Login.Button" />
          </button>
        </div>
      </div>
    </form>
  )
}

export default LoginForm
