import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid2';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "100%",
  maxWidth: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1.6,
};

interface PrayerModalProps {
  openModal: boolean;
  handleClose: () => void;
}

// Coordinates of the Kaaba in Mecca
const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

export default function CompassModal({ openModal, handleClose }: PrayerModalProps) {
  const { t } = useTranslation();
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [currentDirection, setCurrentDirection] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate qibla direction
  const calculateQiblaDirection = (userLat: number, userLng: number): number => {
    // Convert to radians
    const userLatRad = userLat * (Math.PI / 180);
    const userLngRad = userLng * (Math.PI / 180);
    const kaabaLatRad = KAABA_LATITUDE * (Math.PI / 180);
    const kaabaLngRad = KAABA_LONGITUDE * (Math.PI / 180);

    // Calculate qibla direction
    const y = Math.sin(kaabaLngRad - userLngRad);
    const x = Math.cos(userLatRad) * Math.tan(kaabaLatRad) - Math.sin(userLatRad) * Math.cos(kaabaLngRad - userLngRad);
    let qiblaAngle = Math.atan2(y, x) * (180 / Math.PI);

    // Normalize to 0-360 degrees
    qiblaAngle = (qiblaAngle + 360) % 360;

    return qiblaAngle;
  };

  // Get user's location and calculate qibla direction
  useEffect(() => {
    if (openModal) {
      setLoading(true);
      setError(null);

      if (!navigator.geolocation) {
        setError(t('Geolocation is not supported by your browser'));
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const qiblaAngle = calculateQiblaDirection(userLat, userLng);
          setQiblaDirection(qiblaAngle);
          setLoading(false);
        },
        (error) => {
          setError(t('Unable to retrieve your location') + ': ' + error.message);
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [openModal, t]);

  // Handle device orientation for compass
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // Alpha is the compass direction the device is facing in degrees
        setCurrentDirection(event.alpha);
      }
    };

    if (openModal) {
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation);
      } else {
        setError(t('Device orientation is not supported by your browser'));
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [openModal, t]);

  // Calculate the rotation angle for the compass
  const compassRotation = qiblaDirection !== null ? qiblaDirection - currentDirection : 0;

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box borderRadius={5} width={"100%"} maxWidth={500} maxHeight={"80%"} overflow={"auto"} sx={style}>
        <Typography variant="h5" align="center" gutterBottom>
          {t('Qibla Direction')}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" my={2}>
            {error}
          </Typography>
        ) : (
          <>
            <Typography align="center" gutterBottom>
              {t('Point your device towards the arrow to face the Qibla')}
            </Typography>

            <Box textAlign="center" my={2}>
              <Typography variant="body1">
                {t('Qibla is')} {qiblaDirection?.toFixed(1)}° {t('from North')}
              </Typography>
            </Box>

            <svg
              fill="#000000"
              width="100%"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="-33.86 -33.86 406.33 406.33"
              xmlSpace="preserve"
              stroke="#000000"
              strokeWidth="0.0033860500000000003"
              style={{
                transform: `rotate(${compassRotation}deg)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#CCCCCC"
                strokeWidth="12.18978"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g>
                  {" "}
                  <path d="M169.303,0.001C75.949,0.001,0,75.949,0,169.303s75.949,169.302,169.303,169.302s169.303-75.949,169.303-169.302 S262.656,0.001,169.303,0.001z M169.303,320c-83.095,0-150.697-67.603-150.697-150.698S86.208,18.605,169.303,18.605 S320,86.208,320,169.303S252.397,320,169.303,320z"></path>{" "}
                  <path d="M169.303,27.22C90.958,27.22,27.22,90.958,27.22,169.303s63.738,142.083,142.083,142.083s142.083-63.738,142.083-142.083 S247.647,27.22,169.303,27.22z M301.309,189.066l-9.702-1.71l-1.201,6.816l9.708,1.711c-1.095,5.393-2.516,10.668-4.24,15.805 l-9.258-3.369l-2.367,6.504l9.255,3.369c-2.015,5.1-4.335,10.046-6.939,14.817l-8.509-4.912l-3.459,5.994l8.494,4.903 c-2.863,4.657-6.005,9.124-9.399,13.382l-7.492-6.286l-4.449,5.302l7.486,6.282c-3.615,4.085-7.477,7.946-11.561,11.562 l-6.286-7.488l-5.301,4.449l6.29,7.493c-4.258,3.396-8.726,6.538-13.384,9.401l-4.901-8.492l-5.994,3.46l4.909,8.506 c-4.771,2.603-9.718,4.924-14.818,6.939l-3.369-9.254l-6.504,2.368l3.37,9.255c-5.138,1.725-10.412,3.146-15.805,4.24l-1.714-9.705 l-6.816,1.203l1.713,9.698c-5.339,0.796-10.777,1.28-16.301,1.421v-26.382h-6.922v26.382c-5.523-0.141-10.964-0.625-16.303-1.421 l1.714-9.697l-6.814-1.204l-1.716,9.705c-5.393-1.094-10.668-2.515-15.806-4.24l3.371-9.254l-6.502-2.369l-3.371,9.254 c-5.101-2.015-10.046-4.336-14.818-6.939l4.91-8.506l-5.994-3.46l-4.901,8.492c-4.658-2.863-9.126-6.005-13.384-9.401l6.288-7.493 l-5.301-4.449l-6.284,7.488c-4.085-3.616-7.946-7.477-11.562-11.562l7.486-6.282l-4.449-5.302l-7.492,6.286 c-3.395-4.257-6.537-8.725-9.399-13.382l8.494-4.902l-3.459-5.994l-8.509,4.911c-2.604-4.771-4.925-9.717-6.939-14.817l9.254-3.368 l-2.367-6.504l-9.256,3.369c-1.725-5.137-3.146-10.412-4.24-15.805l9.708-1.711l-1.201-6.816l-9.702,1.71 c-0.797-5.339-1.28-10.779-1.422-16.303h26.381v-6.921H35.875c0.142-5.524,0.625-10.963,1.422-16.302l9.702,1.711l1.201-6.816 l-9.708-1.711c1.095-5.393,2.516-10.668,4.24-15.806l9.256,3.369l2.367-6.504l-9.254-3.368c2.016-5.1,4.336-10.046,6.939-14.817 l8.509,4.911l3.459-5.994l-8.494-4.903c2.862-4.657,6.005-9.125,9.399-13.382l7.492,6.286l4.449-5.302l-7.486-6.282 c3.615-4.084,7.477-7.946,11.562-11.562l6.286,7.489l5.301-4.449l-6.29-7.494c4.258-3.396,8.726-6.538,13.384-9.401l4.901,8.492 l5.994-3.46l-4.909-8.506c4.771-2.603,9.718-4.924,14.818-6.939l3.369,9.255l6.504-2.367l-3.37-9.258 c5.137-1.725,10.412-3.146,15.805-4.24l1.714,9.708l6.816-1.203l-1.713-9.702c5.339-0.796,10.777-1.28,16.301-1.421v9.846h6.922 v-9.846c5.523,0.141,10.962,0.625,16.301,1.421l-1.713,9.702l6.816,1.203l1.714-9.708c5.393,1.094,10.667,2.515,15.804,4.239 l-3.369,9.258l6.504,2.367l3.368-9.256c5.101,2.015,10.048,4.336,14.819,6.939l-4.909,8.508l5.994,3.459l4.9-8.493 c4.658,2.863,9.126,6.005,13.384,9.401l-6.289,7.495l5.301,4.449l6.285-7.49c4.085,3.617,7.946,7.479,11.563,11.563l-7.486,6.283 l4.449,5.302l7.492-6.287c3.395,4.257,6.536,8.724,9.398,13.381l-8.494,4.905l3.461,5.993l8.508-4.913 c2.603,4.772,4.924,9.718,6.939,14.818l-9.255,3.37l2.367,6.503l9.258-3.371c1.725,5.138,3.146,10.413,4.24,15.807l-9.708,1.711 l1.201,6.816l9.702-1.711c0.797,5.339,1.28,10.778,1.422,16.302H276.35v6.921h26.381 C302.589,178.287,302.105,183.727,301.309,189.066z"></path>{" "}
                  <path d="M189.766,191.022c4.402-1.555,7.948-7.063,9.68-14.091l-21.099,7.1C181.032,189.691,185.278,192.607,189.766,191.022z"></path>{" "}
                  <path d="M215.203,182.132c4.328-1.53,7.828-6.876,9.592-13.73l-20.868,7.022C206.612,180.9,210.797,183.691,215.203,182.132z"></path>{" "}
                  <path d="M148.846,191.022c4.482,1.585,8.732-1.331,11.414-6.992l-21.1-7.1C140.893,183.958,144.441,189.468,148.846,191.022z"></path>{" "}
                  <path d="M123.4,182.132c4.415,1.559,8.594-1.232,11.281-6.709l-20.868-7.022C115.573,175.255,119.073,180.602,123.4,182.132z"></path>{" "}
                  <path d="M215.471,193.755c-6.798,2.403-13.084-5.339-14.318-17.397l-0.145,0.049c0.6,12.244-4.198,23.842-10.974,26.239 c-6.861,2.424-13.194-5.477-14.35-17.718l-6.379,2.146l-6.377-2.146c-1.156,12.241-7.492,20.141-14.348,17.717 c-6.785-2.397-11.584-13.997-10.981-26.241l-0.146-0.049c-1.234,12.06-7.52,19.802-14.319,17.399 c-6.713-2.375-11.483-13.792-10.984-25.914l-1.959-0.659v44.239l59.115,19.897l59.115-19.897v-44.239l-1.959,0.659 C226.96,179.962,222.189,191.379,215.471,193.755z"></path>{" "}
                  <path d="M110.15,128.777l0.039,0.013v23.872l59.115,19.897l59.115-19.897v-23.873l0.035-0.012l-59.15-21.49L110.15,128.777z M169.305,142.929l-42.667-14.35l42.667-15.501l42.664,15.501L169.305,142.929z"></path>{" "}
                  <polygon points="201.225,110.545 169.303,52.664 137.381,110.436 169.303,91.635 "></polygon>{" "}
                </g>{" "}
              </g>
            </svg>

            <Box display="flex" justifyContent="center" my={2}>
              <Typography variant="body2" color="textSecondary">
                {t('Current device heading')}: {currentDirection.toFixed(1)}°
              </Typography>
            </Box>
          </>
        )}

        <Box display="flex" justifyContent="center" mt={3}>
          <Button variant="contained" onClick={handleClose}>
            {t('Close')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

interface InfoItemType {
  itemName: string;
  value: string | React.ReactNode;
}

const InfoItem = ({ itemName, value }: InfoItemType) => {
  return (
    <Grid container size={12} my={2.5}>
      <Grid size={4}>
        <Typography>{itemName}</Typography>
      </Grid>
      <Grid size={8}>
        <Typography>{value}</Typography>
      </Grid>
    </Grid>
  );
}

