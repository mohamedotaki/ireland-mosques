import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { isIOS } from '../utils/device';

interface Props {
    open: boolean;
    onInstall: () => void;
    onClose: () => void;
}

const InstallDialog: React.FC<Props> = ({ open, onInstall, onClose }) => {
    const isiOS = isIOS();

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Install this app</DialogTitle>
            <DialogContent>
                {isiOS ? (
                    <>
                        <Typography variant="body1">
                            To install this app on your iPhone, tap <strong>Share</strong> and then <strong>"Add to Home Screen"</strong>.
                        </Typography>
                    </>
                ) : (
                    <Typography variant="body1">
                        Install this app on your device for a better experience.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                {!isiOS && <Button onClick={onInstall}>Install</Button>}
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default InstallDialog;
