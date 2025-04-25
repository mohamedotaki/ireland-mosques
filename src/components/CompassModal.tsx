import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { CircularProgress } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useGeolocated } from "react-geolocated";

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

export default function CompassModal({ openModal, handleClose }: PrayerModalProps) {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  });

  const [pointDegree, setPointDegree] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [currentPos, setCurrentPos] = useState<number>(0);
  const [myPointStyle, setMypointStyle] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const calcDegreeToPoint = (latitude: number, longitude: number) => {
    const phiK = (21.4225 * Math.PI) / 180.0;
    const lambdaK = (39.8262 * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi = (180.0 / Math.PI) * Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    );
    setQiblaDirection(Math.round(psi));
    return Math.round(psi);
  };

  const locationHandler = useCallback((coords: any) => {
    const { latitude, longitude } = coords;
    const resP = calcDegreeToPoint(latitude, longitude);
    setPointDegree(resP < 0 ? resP + 360 : resP);
  }, []);

  const handler = useCallback((e: any) => {
    const compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    const rounded = Math.round(Math.abs(compass));
    setCurrentPos(rounded);
    setAccuracy(e.webkitCompassAccuracy ?? 0);

    if (pointDegree < rounded + 2 && pointDegree > rounded - 2) {
      setMypointStyle(1);
    } else {
      setMypointStyle(0);
    }
  }, [pointDegree]);

  const isIOS = () => (
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)
  );

  const startCompass = async () => {
    if (isIOS()) {
      const DeviceOrientationEventAny = DeviceOrientationEvent as any;
      DeviceOrientationEventAny.requestPermission?.()
        .then((response: any) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          } else {
            setError("Location permission is required.");
          }
        })
        .catch(() => setError("Device orientation not supported."));
    } else {
      window.addEventListener("deviceorientationabsolute", handler, true);
    }
  };

  useEffect(() => {
    if (!isGeolocationAvailable) {
      setError("Your browser does not support Geolocation");
      setLoading(false);
    } else if (!isGeolocationEnabled) {
      setError("Geolocation is not enabled. Please allow location in settings.");
      setLoading(false);
    } else if (coords) {
      locationHandler(coords);
      setLoading(false);
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled, locationHandler]);

  useEffect(() => {
    if (openModal) {
      if (coords) locationHandler(coords);
      startCompass();
    } else {
      window.removeEventListener("deviceorientation", handler);
      window.removeEventListener("deviceorientationabsolute", handler);
      setPointDegree(0);
      setCurrentPos(0);
      setMypointStyle(0);
      setAccuracy(0);
      setError(null);
    }

    return () => {
      window.removeEventListener("deviceorientation", handler);
      window.removeEventListener("deviceorientationabsolute", handler);
    };
  }, [openModal, handler, coords, locationHandler]);

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ px: 2 }}
    >
      <Box borderRadius={5} width={"90%"} maxWidth={500} maxHeight={"80%"} overflow={"hidden"} sx={style}>
        <Typography variant="h5" align="center" gutterBottom>
          Qibla Direction
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
              Point your device towards the arrow to face the Qibla
            </Typography>

            <Box textAlign="center" my={2}>
              <Typography variant="body1">
                Qibla is {qiblaDirection?.toFixed(1)}° from North
              </Typography>
            </Box>

            {/* Your SVG Compass */}
            <svg
              width="100%"
              viewBox="-33.86 -33.86 406.33 406.33"
              style={{
                transform: `rotate(${pointDegree - currentPos}deg)`,
                transition: 'transform 0.3s ease-out',
              }}
            >
              {/* SVG contents here */}
            </svg>

            <Box display="flex" justifyContent="center" my={2}>
              <Typography variant="body2" color="textSecondary">
                Current device heading: {currentPos.toFixed(1)}°. Accuracy: {accuracy}°.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
