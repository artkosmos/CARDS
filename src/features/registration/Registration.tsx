import { SignUp } from '@/components/auth/sign-up/SignUp.tsx'
import { useSignUpMutation } from '@/services/auth-service'
import { Navigate } from 'react-router-dom'
import { CreateAccountFields } from '@/schemes/types'

export const Registration = () => {
  const [signUp, result] = useSignUpMutation()

  const { isSuccess, isLoading } = result

  const requestHandler = (data: CreateAccountFields) => {
    const { email, password, name } = data

    signUp({ email, password, name })
  }

  if (isLoading) {
    return <div style={{ textAlign: 'center' }}>Loading...</div>
  }

  if (isSuccess) {
    return <Navigate to={'/login'} />
  }

  return <SignUp onSubmit={requestHandler} />
}
