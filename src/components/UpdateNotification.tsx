import React, { useEffect, useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

const UpdateNotification: React.FC = () => {
    const [showUpdateNotification, setShowUpdateNotification] = useState(false);
    const { t } = useTranslation();



    const onUpdate = () => {
        navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration && registration.waiting) {
                const waitingServiceWorker = registration.waiting;

                // Reload when the new SW takes control
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    window.location.reload();
                });

                // Tell the new SW to activate immediately
                waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
            }
        });
    };

    const checkForUpdates = () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then((registration) => {
                if (!registration) return;

                // Force check for update
                registration.update();

                // If a new SW is already waiting
                if (registration.waiting) {
                    setShowUpdateNotification(true);
                    onUpdate();
                    return;
                }

                // Listen for a new SW being found
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (
                                newWorker.state === 'installed' &&
                                navigator.serviceWorker.controller
                            ) {
                                setShowUpdateNotification(true);
                            }
                        });
                    }
                });
            });
        }
    };

    useEffect(() => {
        checkForUpdates();

        // Re-check when tab becomes visible
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
                {t('Updating to the latest version...')}
            </Alert>
        </Snackbar>
    );
};

export default UpdateNotification;
