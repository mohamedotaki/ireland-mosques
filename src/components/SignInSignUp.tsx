import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, StepIconClassKey } from '@mui/material';
import { UserSignupType, UserType } from '../types/user';
import { useAuth } from '../hooks/AuthContext';
import { SigninType, SignupType } from '../types/authTyps';


const SignInSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [user, setUser] = useState<SignupType | SigninType>({
    email: '',
    password: '',
    ...(isSignUp && {
      name: '',
      phoneNumber: '',
      confirmPassword: ''
    })
  });
  const [badPassword, setBadPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const { signup, signin } = useAuth()

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true)
    setError("")
    if (handlePassCheck()) {
      if (verification) {
        /// handle verification
      } else {
        if (isSignUp) {
          signup(user as SignupType)
        } else {
          signin(user as SigninType)
        }
      }
    }
    setLoading(false)
  };
  const handlePassCheck = (): boolean => {
    if ((user as SigninType).password.length < 8) {
      setBadPassword(true)
      return false
    }
    if (isSignUp && (user as SignupType).password !== (user as SignupType).confirmPassword) {
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
        {!verification ? isSignUp ? 'Sign Up' : 'Sign In' : "Verification"}
      </Typography>

      <form onSubmit={handleFormSubmit}>
        {
          verification ? (
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
              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>Please Check your inbox or junk</Typography>
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
                    value={(user as SignupType).name}
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
                    value={(user as SignupType).phoneNumber}
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
                value={user.email}
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
                value={user.password}
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
                  value={(user as SignupType).confirmPassword}
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
            {!verification ? isSignUp ? 'Sign Up' : 'Sign In' : "Verify"}
          </Button>
          {!verification && <Typography variant="body2" sx={{ mt: 2 }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button onClick={() => setIsSignUp(!isSignUp)} color="primary">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </Typography>}

          {/* Social Login Buttons */}
          {/*           <Box sx={{ mt: 3 }}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}

            />

          </Box> */}
        </Box>
      </form>
    </Container>
  );
};
export default SignInSignUp;
