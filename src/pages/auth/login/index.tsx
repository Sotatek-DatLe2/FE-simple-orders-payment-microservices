import React, { useState, useCallback } from 'react'
// import { LoginUser } from 'src/type/auth'
import styled from 'styled-components'

// Types
interface LoginFormData {
  email: string
  password: string
}

interface SocialButtonProps {
  bg: string
  hoverBg?: string
}

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  max-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const LeftPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 40px;
  min-height: 100vh;

  @media (max-width: 768px) {
    flex: 1;
    min-height: auto;
    padding: 20px;
  }
`

const RightPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #00bfa6 0%, #38d39f 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex: none;
    min-height: 300px;
    padding: 20px;
  }
`

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
`

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`

const Subtitle = styled.p`
  color: #888;
  margin-bottom: 32px;
  text-align: center;
  font-size: 14px;
`

const SocialButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  justify-content: center;
`

const SocialButton = styled.button<SocialButtonProps>`
  background-color: ${(props) => props.bg};
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  font-weight: bold;

  &:hover {
    background-color: ${(props) => props.hoverBg || props.bg};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
  color: #888;
  font-size: 14px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ddd;
  }

  &::before {
    margin-right: 16px;
  }

  &::after {
    margin-left: 16px;
  }
`

const Form = styled.form`
  width: 100%;
`

const InputGroup = styled.div`
  margin-bottom: 20px;
`

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border-radius: 8px;
  border: 2px solid #e1e5e9;
  outline: none;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  box-sizing: border-box;

  &:focus {
    border-color: #20c997;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(32, 201, 151, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }

  &:invalid {
    border-color: #dc3545;
  }
`

const PasswordWrapper = styled.div`
  position: relative;
`

const PasswordInput = styled(Input)`
  padding-right: 50px;
`

const EyeIcon = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #adb5bd;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.3s ease;
  font-size: 18px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #6c757d;
    background-color: #f8f9fa;
  }

  &:focus {
    outline: 2px solid #20c997;
    outline-offset: 2px;
  }
`

const SignInButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #20c997 0%, #17b38a 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(32, 201, 151, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const ForgotPassword = styled.a`
  display: block;
  text-align: center;
  color: #20c997;
  text-decoration: none;
  font-size: 14px;
  margin-top: 16px;
  transition: color 0.3s ease;

  &:hover {
    color: #17b38a;
    text-decoration: underline;
  }
`

const SignUpTitle = styled.h3`
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`

const SignUpText = styled.p`
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
  opacity: 0.9;
`

const SignUpButton = styled.button`
  background-color: white;
  color: #20c997;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  border: 2px solid white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    background-color: transparent;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 20px;
  font-weight: bold;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 4px;
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-right: 8px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

// Main Component
const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 0
  }

  // Event handlers
  const handleInputChange = useCallback(
    (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setFormData((prev) => ({ ...prev, [field]: value }))

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors]
  )

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const handleSocialLogin = useCallback((provider: string) => {
    console.log(`Login with ${provider}`)
    // Implement social login logic here
  }, [])

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate form
      const newErrors: Partial<LoginFormData> = {}

      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }

      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      setIsLoading(true)

      try {
        window.location.href = `/`
        localStorage.setItem('accessToken', 'dummy-token')
        // Simulate API call
        // const response = await authServices.login({
        //   email: formData.email,
        //   password: formData.password,
        // } as LoginUser)
        // if (response.status === 200 || response.status === 201) {
        //   const token = response.data.data.token
        //   const user = response.data.data.user
        //   user.dob = new Date(response.data.data.dob).toLocaleDateString('en-CA')
        //   localStorage.setItem('accessToken', token)
        //   localStorage.setItem('user', JSON.stringify(user))
        //   localStorage.setItem('userId', response.data.data.user_id)
        //   localStorage.setItem('role', response.data.data.role)
        //   const role = response.data.data.role.toLowerCase()
        //   // Redirect to dashboard or home page
        //   if (user.role === 'patient' || user.role === 'Patient') {
        //     window.location.href = `/`
        //   }
        // } else if (response.status === 401) {
        //   setErrors({ email: 'Invalid email or password' })
        // } else {
        //   setErrors({ email: 'Login failed. Please try again.' })
        // }
        // Handle successful login (redirect, store token, etc.)
      } catch (error) {
        console.error('Login failed:', error)
        // Handle login error
      } finally {
        setIsLoading(false)
      }
    },
    [formData]
  )

  const handleClose = useCallback(() => {
    console.log('Close login modal')
    // Implement close logic (redirect, close modal, etc.)
  }, [])

  const handleSignUp = useCallback(() => {
    console.log('Navigate to sign up')
    window.location.href = '/sign-up'
  }, [])

  return (
    <Container>
      <LeftPanel>
        <FormContainer>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to your account to continue</Subtitle>

          <SocialButtons>
            <SocialButton
              bg="#3b5998"
              hoverBg="#2d4373"
              onClick={() => handleSocialLogin('Facebook')}
              type="button"
              title="Sign in with Facebook"
            >
              f
            </SocialButton>
            <SocialButton
              bg="#db4437"
              hoverBg="#c23321"
              onClick={() => handleSocialLogin('Google')}
              type="button"
              title="Sign in with Google"
            >
              G
            </SocialButton>
            <SocialButton
              bg="#0077b5"
              hoverBg="#005885"
              onClick={() => handleSocialLogin('LinkedIn')}
              type="button"
              title="Sign in with LinkedIn"
            >
              in
            </SocialButton>
          </SocialButtons>

          <Divider>OR</Divider>

          <Form onSubmit={handleLogin}>
            <InputGroup>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                aria-label="Email address"
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <PasswordWrapper>
                <PasswordInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  aria-label="Password"
                />
                <EyeIcon
                  type="button"
                  onClick={handleTogglePassword}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </EyeIcon>
              </PasswordWrapper>
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </InputGroup>

            <SignInButton type="submit" disabled={isLoading}>
              {isLoading && <LoadingSpinner />}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </SignInButton>
          </Form>

          <ForgotPassword href="/forgot-password">Forgot your password?</ForgotPassword>
        </FormContainer>
      </LeftPanel>

      <RightPanel>
        <CloseButton onClick={handleClose} title="Close">
          ×
        </CloseButton>
        <SignUpTitle>New Here?</SignUpTitle>
        <SignUpText>Join us today and discover amazing opportunities waiting for you!</SignUpText>
        <SignUpButton onClick={handleSignUp}>Create Account</SignUpButton>
      </RightPanel>
    </Container>
  )
}

export default Login
