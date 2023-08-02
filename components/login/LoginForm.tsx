import React, { useState, useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Flex, Box, Input, Button } from 'ooni-components'
import styled from 'styled-components'

import { registerUser } from 'lib/api'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
// import SpinLoader from 'components/vendor/SpinLoader'

const StyledError = styled.small``
// color: ${(props) => props.theme.colors.red5};

const StyledInputContainer = styled(Box).attrs({
  width: '100%',
  mt: 3,
})`
  position: relative;
  & ${StyledError} {
    position: absolute;
    top: -10px;
    right: 0px;
  }
`
type LoginFormProps = {
  onLogin: () => void
  redirectTo?: string
}

export const LoginForm = ({ onLogin, redirectTo }: LoginFormProps) => {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [loginError, setError] = useState(null)

  const { handleSubmit, control, formState, reset } = useForm({
    mode: 'onTouched',
    defaultValues: { email_address: '' },
  })

  const { errors, isValid, isDirty } = formState

  const onSubmit = useCallback(
    (data: { email_address: string }) => {
      const { email_address } = data
      const registerApi = async (email_address: string) => {
        try {
          await registerUser(email_address, redirectTo)
          onLogin()
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
    [onLogin, reset, redirectTo]
  )

  useEffect(() => {
    // Remove previous errors when form becomes dirty again
    if (isDirty) {
      setError(null)
    }
  }, [isDirty])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDirection={['column']}>
        <StyledInputContainer>
          <Controller
            render={({ field }) => <Input placeholder="Email *" {...field} />}
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
          <StyledError>{errors?.email_address?.message}</StyledError>
        </StyledInputContainer>
        {loginError && (
          <Box mt={1}>
            <StyledError>{loginError}</StyledError>
          </Box>
        )}
        <Box mt={3} alignSelf="center">
          {!submitting ? (
            <Button disabled={!isValid} type="submit">
              <FormattedMessage id="Navbar.Login" />
            </Button>
          ) : (
            // <SpinLoader size={3} margin='1px' />
            <h3>LOADING</h3>
          )}
        </Box>
      </Flex>
    </form>
  )
}

export default LoginForm