import React, { useEffect, useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface UpdateNotificationProps {
    onUpdate: () => void;
}

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ onUpdate }) => {
    const [showUpdateNotification, setShowUpdateNotification] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        // Listen for service worker update
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                setShowUpdateNotification(true);
                            }
                        });
                    }
                });
            });
        }
    }, []);

    const handleUpdate = () => {
        setShowUpdateNotification(false);
        onUpdate();
    };

    return (
        <Snackbar
            open={showUpdateNotification}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert
                severity="info"
                action={
                    <Button color="inherit" size="small" onClick={handleUpdate}>
                        {t('update')}
                    </Button>
                }
            >
                {t('newVersionAvailable')}
            </Alert>
        </Snackbar>
    );
};

export default UpdateNotification;