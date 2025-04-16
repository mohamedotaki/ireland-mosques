import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import logo from "../assets/logo.png";


// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export default function AppLoading({ error }: { error: string }) {
  return (
    <>
    <Box sx={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "80%",
      maxWidth: "400px",
      animation: `${fadeIn} 1s ease-in-out`
    }}>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        animation: `${pulse} 2s infinite ease-in-out`
      }}>
        <img src={logo} alt="Logo" style={{ width: "70px" }} />
        <Typography sx={{
          textAlign: "center",
          fontSize: "26px",
          fontWeight: 600,
        }}>{process.env.REACT_APP_NAME}</Typography>
      </Box>
      {error !== "" && <Typography sx={{
        pt: 3,
        textAlign: "center",
        color: "red",
      }}>{error}</Typography>}

    </Box>
    <Box sx={{
  position: "fixed",
  left: 0,
  display:"flex",
  justifyContent:"center",
  width:"100%",
  bottom:10,
  
}}>
 <Typography>{process.env.REACT_APP_VERSION}</Typography>
</Box>
    </>
  );
}
