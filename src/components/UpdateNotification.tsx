import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

const UpdateNotification: React.FC = () => {
    const [showUpdateNotification, setShowUpdateNotification] = useState(false);
    const { t } = useTranslation();

    const onUpdate = () => {
        navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration?.waiting) {
                const waitingSW = registration.waiting;

                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    window.location.reload();
                });

                waitingSW.postMessage({ type: 'SKIP_WAITING' });
            }
        });
    };

    const checkForUpdates = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (!registration) return;

                registration.update();

                if (registration.waiting) {
                    setShowUpdateNotification(true);
                    onUpdate(); // Immediately update without asking the user
                    return;
                }

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (
                                newWorker.state === 'installed' &&
                                navigator.serviceWorker.controller
                            ) {
                                setShowUpdateNotification(true);
                                onUpdate(); // Automatically update on install
                            }
                        });
                    }
                });
            });
        }
    };

    useEffect(() => {
        checkForUpdates();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkForUpdates();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <Snackbar
            open={showUpdateNotification}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert severity="info" sx={{ width: '100%' }}>
                {t('Updating to the latest version...')}
            </Alert>
        </Snackbar>
    );
};

export default UpdateNotification;
