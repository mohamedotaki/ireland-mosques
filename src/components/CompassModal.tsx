import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGeolocated } from 'react-geolocated';

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

const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

export default function CompassModal({ openModal, handleClose }: PrayerModalProps) {
  const { t } = useTranslation();
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [currentDirection, setCurrentDirection] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError,
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    watchPosition: false,
    suppressLocationOnMount: false,
    userDecisionTimeout: 10000,
  });

  const calculateQiblaDirection = (userLat: number, userLng: number): number => {
    const userLatRad = userLat * (Math.PI / 180);
    const userLngRad = userLng * (Math.PI / 180);
    const kaabaLatRad = KAABA_LATITUDE * (Math.PI / 180);
    const kaabaLngRad = KAABA_LONGITUDE * (Math.PI / 180);

    const y = Math.sin(kaabaLngRad - userLngRad);
    const x = Math.cos(userLatRad) * Math.tan(kaabaLatRad) - Math.sin(userLatRad) * Math.cos(kaabaLngRad - userLngRad);
    let qiblaAngle = Math.atan2(y, x) * (180 / Math.PI);

    return (qiblaAngle + 360) % 360;
  };

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let heading: number | null = null;

      if ((event as any).webkitCompassHeading !== undefined) {
        heading = (event as any).webkitCompassHeading;
      } else if (event.absolute === true && event.alpha !== null) {
        heading = 360 - event.alpha;
      } else if (event.alpha !== null) {
        heading = 360 - event.alpha;
      }

      if (heading !== null) {
        heading = (heading + 360) % 360;
        setCurrentDirection(heading);
      }
    };

    const enableOrientation = async () => {
      try {
        if (
          typeof (DeviceOrientationEvent as any).requestPermission === 'function'
        ) {
          const permissionState = await (DeviceOrientationEvent as any).requestPermission();
          if (permissionState === 'granted') {
            window.addEventListener(
              'deviceorientationabsolute',
              handleOrientation as EventListener,
              true
            );
          } else {
            setError(t('Permission to access device orientation was denied'));
          }
        } else {
          window.addEventListener(
            'deviceorientationabsolute',
            handleOrientation as EventListener,
            true
          );
          window.addEventListener(
            'deviceorientation',
            handleOrientation as EventListener,
            true
          );
        }
      } catch (err) {
        setError(t('Device orientation access failed'));
      }
    };

    if (openModal) {
      enableOrientation();
    }

    return () => {
      window.removeEventListener(
        'deviceorientationabsolute',
        handleOrientation as EventListener
      );
      window.removeEventListener(
        'deviceorientation',
        handleOrientation as EventListener
      );
    };
  }, [openModal, t]);


  const compassRotation = qiblaDirection !== null ? qiblaDirection - currentDirection : 0;

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box borderRadius={5} width="100%" maxWidth={500} maxHeight="80%" overflow="auto" sx={style}>
        <Typography variant="h5" align="center" gutterBottom>
          {t('Qibla Direction')}
        </Typography>

        {!coords && !error ? (
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

            {/* Compass needle */}
            <svg
              fill="#000000"
              width="100%"
              viewBox="-33.86 -33.86 406.33 406.33"
              style={{
                transform: `rotate(${compassRotation}deg)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              {/* SVG content left unchanged */}
              {/* Replace this comment with your full SVG icon from previous code */}
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
