import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/AuthContext';
import { SigninType, SignupType } from '../../types/authTyps';
import AuthWrapper from './AuthWrapper';

type SigninProps = {
    onSwitch: () => void;
};

const Signin = ({ onSwitch }: SigninProps) => {
    const { t } = useTranslation()
    const { signin, loading } = useAuth()
    const [inputData, setUser] = useState<SigninType>({
        email: '',
        password: ''

    });
    const [badPassword, setBadPassword] = useState(false);

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (handlePassCheck()) {
            signin(inputData)
        }
    };

    const handlePassCheck = (): boolean => {
        if (inputData.password.length < 8) {
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
        <AuthWrapper title="SignIn" onSubmit={handleFormSubmit} >
            <TextField
                fullWidth
                name='email'
                label={t('Email')}
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
                label={t("Password")}
                variant="outlined"
                margin="none"
                type="password"
                required
                value={inputData.password}
                onChange={handleFieldChange}
                error={badPassword}
            />

            <Button sx={{ mt: 2 }} loading={loading} type="submit" variant="contained" color="primary" fullWidth>
                {t('SignIn')}
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
                {t('Donthaveanaccount')}

                <Button onClick={onSwitch} color="primary">
                    {t('SignUp')}

                </Button>
            </Typography>

        </AuthWrapper>
    );
};
export default Signin;
