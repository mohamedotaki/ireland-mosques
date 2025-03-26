import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid, StepIconClassKey } from '@mui/material';
import { UserSignupType, UserType } from '../types/user';
import { apiPost } from '../utils/api';
import { useAuth } from '../hooks/AuthContext';
/* import { GoogleLogin } from '@react-oauth/google';
 */



const SignInSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false); // toggle between SignUp and SignIn
  const [loading, setLoading] = useState(false); // toggle between SignUp and SignIn
  const [verification, setVerification] = useState(true); // toggle between SignUp and SignIn
  const [verificationCode, setVerificationCode] = useState(""); // toggle between SignUp and SignIn
  const [user, setUser] = useState<UserSignupType>({
    email: '',
    password: ''
  });
  const [badPassword, setBadPassword] = useState(false); // toggle between SignUp and SignIn
  const [error, setError] = useState<string>(""); // toggle between SignUp and SignIn
  const { login } = useAuth()


  // Handle form submission (SignUp or SignIn)
  const handleFormSubmit = async (event: React.FormEvent) => {
    setLoading(true)
    event.preventDefault();
    setError("")
    if (verification) {
      const { data, error } = await apiPost<{ verificationCode: string }, UserType>('auth/verify', { verificationCode })
      if (data) {
        login(data)
      } else {
        setError(error || "")
      }
    } else {
      if (user.password.length < 8 || user.password !== user.confirmPassword) {
        setBadPassword(true)
        return
      }
      if (isSignUp) {
        badPassword && setBadPassword(false)
        const { data, error } = await apiPost('auth/signup', { user })
        console.log(data, error)
        if (data) {
          setVerification(true)
        } else {
          setError(error || "")
        }
      } else {
        const { data, error } = await apiPost<{ user: UserSignupType }, UserType>('auth/signin', { user })
        if (data) {
          setVerification(true)
        } else {
          setError(error || "")
        }
        badPassword && setBadPassword(false)
      }
    }
    setLoading(false)

  };
  const handleGoogleLogin = (response: any) => {
    console.log("Google Login Success", response);
    // Implement further login logic
  };

  // Facebook login success handler
  const handleFacebookLogin = (response: any) => {
    console.log("Facebook Login Success", response);
    // Implement further login logic
  };



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
                    value={user.name}
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
                    value={user.phoneNumber}
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

              {/* Conditional field for Confirm Password (only visible during SignUp) */}
              {isSignUp && (
                <TextField
                  fullWidth
                  name='confirmPassword'
                  label="Confirm Password"
                  variant="outlined"
                  margin="normal"
                  type="password"
                  required
                  value={user.confirmPassword}
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
