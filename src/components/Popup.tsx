import React, { useEffect, useRef } from 'react';
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
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to handle outside clicks
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose(); // Close the popup if the click is outside the popup
      }
    };

    // Add event listener for detecting outside clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener when component unmounts or show changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Function to format message with line breaks
  const formatMessage = (msg: string) => {
    // Check if message contains new lines, then replace them with <br /> tags
    return msg.split('\n').map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  };

  return (
    <Box
      ref={popupRef}
      sx={{
        position: 'fixed',
        top: 20, // Adjust this value to set how far from the top you want the popup
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', // Make the width fit the content
        minWidth: '250px', // Ensure the minimum width is 250px
        maxWidth: '400px',
        zIndex: 2300, // Ensure it's above most other elements
        px: 2,
      }}
    >
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
          {/* Render formatted message with line breaks */}
          {formatMessage(message)}
        </Alert>
      </Collapse>
    </Box>
  );
}
