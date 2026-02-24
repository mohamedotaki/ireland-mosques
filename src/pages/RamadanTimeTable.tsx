import { Alert, Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export default function RamadanTimeTable() {
  const [open, setOpen] = useState<boolean>(false);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleOpen = () => {
    if (isMobile) {
      window.open("/Ramadan_TimeTable.pdf", "_blank");
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Alert icon={false} severity="info" onClick={handleOpen} sx={{ cursor: "pointer", justifyContent: "center", textAlign: "center", }}>
        Show Ramadan Timetable
      </Alert>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90vw",
            height: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >


          <iframe
            src="/Ramadan_TimeTable.pdf"
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="PDF Viewer"
          />
        </Box>
      </Modal>
    </>
  );
}