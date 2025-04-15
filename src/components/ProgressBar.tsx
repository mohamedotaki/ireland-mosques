import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Typography } from '@mui/material';


export default function ProgressBar({ progress = 0, time }: { progress: number, time: string }) {

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>

      <LinearProgress variant="determinate" value={progress} sx={{ height: 25 }} />
      <Typography
        variant="body2"
        color="black"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1, // Make sure text is above the progress bar
        }}
      >
        {time}
      </Typography>
    </Box>
  );
}
