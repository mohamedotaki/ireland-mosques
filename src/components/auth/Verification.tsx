import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/AuthContext';
import AuthWrapper from './AuthWrapper';

const Verification = () => {
    const { t, i18n } = useTranslation();
    const { verify, resendVerificationCode, signout, loading } = useAuth();
    const [verificationCode, setVerificationCode] = useState('');
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [resendDisabled, setResendDisabled] = useState(true);



    // Countdown timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (resendDisabled && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        if (timer === 0) {
            setResendDisabled(false);
        }

        return () => clearInterval(interval);
    }, [timer, resendDisabled]);

    const handleVerification = async (event: React.FormEvent) => {
        event.preventDefault();
        const isVerified = await verify(verificationCode);

    };

    const handleResend = async () => {
        const isSent = await resendVerificationCode();
        if (isSent) {
            setTimer(300);
            setResendDisabled(true);
        }
    };

    // Format time as mm:ss
    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <AuthWrapper title="Verification" onSubmit={handleVerification} >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <TextField
                    fullWidth
                    name="verificationCode"
                    label="Verification Code"
                    variant="outlined"
                    margin="normal"
                    type="text"
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                />

                <Box sx={{ display: 'flex', direction: i18n.dir(), alignItems: 'center', gap: 1 }}>
                    <Button onClick={handleResend} size="small" variant="text" disabled={resendDisabled}>
                        {t('ResendVerificationCode')}
                    </Button>
                    {resendDisabled && (
                        <Typography variant="body2" color="text.secondary">
                            ({formatTime(timer)})
                        </Typography>
                    )}
                </Box>

                <Button loading={loading} type="submit" variant="contained" color="primary" fullWidth>
                    {t('Verify')}

                </Button>
                <Button loading={loading} variant="text" color="error" size="small" onClick={signout}>
                    {t('Logout')}

                </Button>
            </Box>
        </AuthWrapper>
    );
};

export default Verification;
