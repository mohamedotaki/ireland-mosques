import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface AuthWrapperProps {
    title: string;
    onSubmit?: React.FormEventHandler<HTMLFormElement>; // make it optional if needed
    children: React.ReactNode;
}

// Wrapper for authentication forms (common structure, used by SignIn, SignUp, etc.)
const AuthWrapper = ({ title, onSubmit, children }: AuthWrapperProps) => {
    const { t } = useTranslation()

    return (
        <Container maxWidth="xs" sx={{ mt: 8, pb: 8 }}>
            <Typography variant="h4" align="center" gutterBottom>
                {t(title)}
            </Typography>
            <form onSubmit={onSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "center", gap: 2 }}>
                    {children}
                </Box>
            </form>
        </Container>
    );
};

export default AuthWrapper;
