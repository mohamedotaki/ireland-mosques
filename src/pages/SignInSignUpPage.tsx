import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { UserSignupType } from '../types/user';
import { apiPost } from '../utils/api';
/* import { GoogleLogin } from '@react-oauth/google';
 */



const SignInSignUpPage = () => {
  const [isSignUp, setIsSignUp] = useState(false); // toggle between SignUp and SignIn
  const [user, setUser] = useState<UserSignupType>({
    name: '',
    password: '',
    password2: '',
    phoneNumber: '',
  });


  // Handle form submission (SignUp or SignIn)
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = await apiPost('auth/signup', { user })
    console.log("data", data)
  };

  // Google login success handler
  const handleGoogleLogin = (response: any) => {
    console.log("Google Login Success", response);
    // Implement further login logic
  };

  // Facebook login success handler
  const handleFacebookLogin = (response: any) => {
    console.log("Facebook Login Success", response);
    // Implement further login logic
  };
  console.log("user", user)
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
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Typography>

      <form onSubmit={handleFormSubmit}>
        {isSignUp && <TextField
          fullWidth
          name='name'
          label="Name"
          variant="outlined"
          margin="normal"
          type="text"
          required
          onChange={handleFieldChange}
        />}
        <TextField
          fullWidth
          name='email'
          label="Email"
          variant="outlined"
          margin="normal"
          type="email"
          required
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
          onChange={handleFieldChange}

        />

        {/* Conditional fields for SignUp */}
        {isSignUp && (
          <>
            <TextField
              fullWidth
              name='password2'
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              type="password"
              required
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
              onChange={handleFieldChange}


            />
          </>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Button onClick={() => setIsSignUp(!isSignUp)} color="primary">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Button>
          </Typography>

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

export default SignInSignUpPage;
