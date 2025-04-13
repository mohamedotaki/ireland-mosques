import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

type PopupProps = {
  message: string;
  type: "success" | "info" | "warning" | "error";
  show: boolean;
  onClose: () => void;
};

export default function Popup({ message, type, show, onClose }: PopupProps) {
  console.log("popup rendering");

  return (
    <Box sx={{
      position: 'fixed',
      top: 20, // Adjust this value to set how far from the top you want the popup
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%', // Make the width fit the content
      minWidth: '250px', // Ensure the minimum width is 250px
      maxWidth: "400px",
      zIndex: 2300 // Ensure it's above most other elements
    }}>
      <Collapse in={show}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          severity={type}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
}
