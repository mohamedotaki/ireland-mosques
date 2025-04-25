import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGeolocated } from "react-geolocated";

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 500,
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 4,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

interface PrayerModalProps {
  openModal: boolean;
  handleClose: () => void;
}

export default function CompassModal({ openModal, handleClose }: PrayerModalProps) {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pointDegree, setPointDegree] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [CurrentPos, setCurrentPos] = useState<number>(0);

  const isIOS = () => (
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !!navigator.userAgent.match(/AppleWebKit/)
  );

  const calcQiblaDirection = (lat: number, lng: number) => {
    const kaabaLat = 21.422487;
    const kaabaLng = 39.826206;
    const phiK = (kaabaLat * Math.PI) / 180.0;
    const lambdaK = (kaabaLng * Math.PI) / 180.0;
    const phi = (lat * Math.PI) / 180.0;
    const lambda = (lng * Math.PI) / 180.0;
    const psi = (180.0 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
      );

    const angle = Math.round(psi < 0 ? psi + 360 : psi);
    setPointDegree(angle);
    setQiblaDirection(angle);
  };

  const handleOrientation = (e: any) => {
    const compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    setCurrentPos(Math.round(Math.abs(compass)));
  };

  const initCompass = async () => {
    if (isIOS()) {
      try {
        const DeviceOrientationEventAny = DeviceOrientationEvent as any;
        const permission = await DeviceOrientationEventAny.requestPermission?.();
        if (permission === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true);
        } else {
          setError("Permission for device orientation denied.");
        }
      } catch {
        setError("Compass not supported or permission request failed.");
      }
    } else {
      window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    }
  };

  useEffect(() => {
    if (!isGeolocationAvailable) {
      setError("Your browser does not support Geolocation.");
      setLoading(false);
    } else if (!isGeolocationEnabled) {
      setError("Geolocation is disabled. Please allow location access.");
      setLoading(false);
    } else if (coords) {
      calcQiblaDirection(coords.latitude, coords.longitude);
      initCompass();
      setLoading(false);
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  return (
    <Modal open={openModal} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" align="center" gutterBottom>
          Qibla Direction
        </Typography>

        <Box flexGrow={1} overflow="hidden">
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" mt={2}>
              {error}
            </Typography>
          ) : (
            <>
              <Typography align="center" gutterBottom>
                Point your device toward the arrow to face the Qibla
              </Typography>
              <Box textAlign="center" mb={2}>
                <Typography>
                  Qibla is {qiblaDirection.toFixed(1)}° from North
                </Typography>
              </Box>
              <Box width="100%" display="flex" justifyContent="center">
                <svg
                  fill="#000000"
                  width="80%"
                  viewBox="-33.86 -33.86 406.33 406.33"
                  style={{
                    transform: `rotate(${pointDegree - CurrentPos}deg)`,
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  {/* Keep your SVG icon code here */}
                </svg>
              </Box>
              <Typography align="center" variant="body2" color="textSecondary" mt={2}>
                Current heading: {CurrentPos.toFixed(1)}°
              </Typography>
            </>
          )}
        </Box>

        <Box mt={3} display="flex" justifyContent="center">
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
