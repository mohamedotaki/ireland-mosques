import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../hooks/AuthContext';
import { SigninType, SignupType } from '../types/authTyps';
import { useTranslation } from 'react-i18next';


const SignInSignUp = () => {
  const { t } = useTranslation()
  const { user, signup, signin, verify, resendVerificationCode, signout, loading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<string>();
  const [verificationCode, setVerificationCode] = useState("");
  const [inputData, setUser] = useState<SignupType | SigninType>({
    email: '',
    password: '',
    ...(isSignUp && {
      name: '',
      phoneNumber: '',
      confirmPassword: ''
    })
  });
  const [badPassword, setBadPassword] = useState(false);
  const [error, setError] = useState<string | undefined>("");

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("")
    if (user?.account_status === "Pending") {
      verify(verificationCode)

    } else {
      if (handlePassCheck()) {
        if (isSignUp) {
          signup(inputData as SignupType)
        } else {
          signin(inputData as SigninType)
        }
      }
    }
    setMessage("")
  };
  const handlePassCheck = (): boolean => {
    if ((inputData as SigninType).password.length < 8) {
      setBadPassword(true)
      return false
    }
    if (isSignUp && (inputData as SignupType).password !== (inputData as SignupType).confirmPassword) {
      setBadPassword(true)
      return false
    }
    setBadPassword(false)
    return true
  }

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {user?.account_status === "Pending" ? "Verification" : isSignUp ? 'Sign Up' : 'Sign In'}
      </Typography>

      <form onSubmit={handleFormSubmit}>
        {
          user?.account_status === "Pending" ? (
            <>
              <TextField
                fullWidth
                name='verificationCode'
                label="Verification Code"
                variant="outlined"
                margin="normal"
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Button onClick={resendVerificationCode} variant="text">{t("ResendVerificationCode")}</Button>
              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>{message}</Typography>


            </>
          ) : (
            <>
              {isSignUp && (
                <>
                  <TextField
                    fullWidth
                    name='name'
                    label="Full Name"
                    variant="outlined"
                    margin="normal"
                    type="text"
                    required
                    value={(inputData as SignupType).name}
                    onChange={handleFieldChange}
                  />
                  <TextField
                    fullWidth
                    name='phoneNumber'
                    label="Phone Number"
                    variant="outlined"
                    margin="normal"
                    type="tel"
                    inputMode="tel"
                    required
                    value={(inputData as SignupType).phoneNumber}
                    onChange={handleFieldChange}
                  />
                </>
              )}

              <TextField
                fullWidth
                name='email'
                label="Email"
                variant="outlined"
                margin="normal"
                type="email"
                required
                value={inputData.email}
                onChange={handleFieldChange}
              />
              <TextField
                fullWidth
                name='password'
                label="Password"
                variant="outlined"
                margin="normal"
                type="password"
                required
                value={inputData.password}
                onChange={handleFieldChange}
                error={badPassword}
              />

              {isSignUp && (
                <TextField
                  fullWidth
                  name='confirmPassword'
                  label="Confirm Password"
                  variant="outlined"
                  margin="normal"
                  type="password"
                  required
                  value={(inputData as SignupType).confirmPassword}
                  onChange={handleFieldChange}
                  error={badPassword}
                />
              )}
            </>
          )
        }

        {error && <Typography variant="body2" sx={{ mt: 2, color: 'red', textAlign: "center" }}>{error}</Typography>
        }
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Button loading={loading} type="submit" variant="contained" color="primary" fullWidth>
            {user?.account_status === "Pending" ? "Verify" : isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>

          {user?.account_status === "Pending" && <Button loading={loading} sx={{ mt: 4 }} variant="text" color="error" size="small" onClick={signout}>Logout</Button>}

          {user?.account_status !== "Pending" && <Typography variant="body2" sx={{ mt: 2 }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button onClick={() => setIsSignUp(!isSignUp)} color="primary">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </Typography>}
        </Box>
      </form>
    </Container>
  );
};
export default SignInSignUp;
