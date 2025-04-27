import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SignupType } from '../../types/authTyps';
import { useAuth } from '../../hooks/AuthContext';
import AuthWrapper from './AuthWrapper';
import { getFromLocalDB, LocalStorageKeys } from '../../utils/localDB';

type SignupProps = {
  onSwitch: () => void;
};

const Signup = ({ onSwitch }: SignupProps) => {
  const { t } = useTranslation()
  const { signup, loading } = useAuth()
  const [badPassword, setBadPassword] = useState(false);
  const [inputData, setUser] = useState<SignupType>({
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    confirmPassword: '',
    settings: getFromLocalDB(LocalStorageKeys.AppSettings)
  });

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (handlePassCheck()) {
      signup(inputData)

    }

  };
  const handlePassCheck = (): boolean => {
    if (inputData.password.length < 8) {
      setBadPassword(true)
      return false
    } else if (inputData.password !== inputData.confirmPassword) {
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
    <AuthWrapper title="SignUp" onSubmit={handleFormSubmit} >
      <TextField
        fullWidth
        name='name'
        label={t("FullName")}
        variant="outlined"
        type="text"
        required
        value={inputData.name}
        onChange={handleFieldChange}
      />
      <TextField
        fullWidth
        name='phoneNumber'
        label={t("PhoneNumber")}
        variant="outlined"
        type="tel"
        inputMode="tel"
        required
        value={inputData.phoneNumber}
        onChange={handleFieldChange}
      />

      <TextField
        fullWidth
        name='email'
        label={t("Email")}
        variant="outlined"
        type="email"
        required
        value={inputData.email}
        onChange={handleFieldChange}
      />
      <TextField
        fullWidth
        name='password'
        label={t("Password")}
        variant="outlined"
        type="password"
        required
        value={inputData.password}
        onChange={handleFieldChange}
        error={badPassword}
      />


      <TextField
        fullWidth
        name='confirmPassword'
        label={t("ConfirmPassword")}
        variant="outlined"
        type="password"
        required
        value={inputData.confirmPassword}
        onChange={handleFieldChange}
        error={badPassword}
      />

      <Button loading={loading} type="submit" variant="contained" color="primary" fullWidth>
        {t('SignUp')}
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        {t("Alreadyhaveanaccount")}
        <Button onClick={onSwitch} color="primary">
          {t("SignIn")}

        </Button>
      </Typography>
    </AuthWrapper>
  );
};
export default Signup;
