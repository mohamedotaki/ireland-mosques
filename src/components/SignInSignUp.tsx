import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { UserSignupType, UserType } from '../types/user';
import { apiPost } from '../utils/api';
import { useAuth } from '../hooks/AuthContext';
/* import { GoogleLogin } from '@react-oauth/google';
 */



const SignInSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false); // toggle between SignUp and SignIn
  const [loading, setLoading] = useState(false); // toggle between SignUp and SignIn
  const [user, setUser] = useState<UserSignupType>({
    email: '',
    password: ''
  });
  const [badPassword, setBadPassword] = useState(false); // toggle between SignUp and SignIn
  const [error, setError] = useState<string>(""); // toggle between SignUp and SignIn
  const { login } = useAuth()


  // Handle form submission (SignUp or SignIn)
  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("")
    if (user.password.length < 8) {
      setBadPassword(true)
      return
    }
    if (isSignUp) {
      if (user.password !== user.confirmPassword) {
        setBadPassword(true)
        return
      }
      badPassword && setBadPassword(false)
      setLoading(true)
      const { data, error } = await apiPost('auth/signup', { user })
      setLoading(false)
      data && setIsSignUp(false)
      error && setError(error || "")
      setUser({
        email: '',
        password: ''
      })
    } else {
      setLoading(true)
      const { data, error } = await apiPost<{ user: UserSignupType }, UserType>('auth/signin', { user })
      if (data) {
        login(data)
      } else {
        setError(error || "")
      }
      badPassword && setBadPassword(false)
      setLoading(false)
    }
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
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Typography>

      <form onSubmit={handleFormSubmit}>
        {isSignUp && <TextField
          fullWidth
          name='name'
          label="Full Name"
          variant="outlined"
          margin="normal"
          type="text"
          required
          value={user.name}
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

        {/* Conditional fields for SignUp */}
        {isSignUp && (
          <>
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
        {error && <Typography variant="body2" sx={{ mt: 2, color: 'red', textAlign: "center" }}>{error}</Typography>
        }
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <Button loading={loading} type="submit" variant="contained" color="primary" fullWidth>
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

export default SignInSignUp;
