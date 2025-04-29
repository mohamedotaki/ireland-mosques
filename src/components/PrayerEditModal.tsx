import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { PrayerType } from '../types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { Container, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { apiPost } from '../utils/api';
import { addHours, format } from 'date-fns';
import { usePopup } from '../hooks/PopupContext';
import { useUpdate } from '../hooks/UpdateContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1.6,
  borderRadius: 5
};

interface PrayerModalProps {
  openModal: boolean;
  prayer: PrayerType;
  mosqueID: number;
  isIqamahClicked: boolean;
  handleClose: () => void;
}

type PrayerTimeUpdate = {
  mosqueID: number;
  prayerID: number;
  newPrayerTime: string | null;
  offset: number | null;
  isIqamah: boolean;
};

export default function PrayerEditModal({
  prayer,
  mosqueID,
  openModal,
  handleClose,
  isIqamahClicked
}: PrayerModalProps) {
  const { showPopup } = usePopup();
  const [prayerToEdit, setPrayerToEdit] = useState<any>(prayer);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<"fixed" | "offset">(
    isIqamahClicked ? prayer.iqamahMode || "fixed" : "fixed"
  );
  const { t } = useTranslation();
  const { checkForUpdate } = useUpdate();
  const [minMaxTime, setMinMaxTime] = useState<{ hourMin: number; hourMax: number }>({ hourMin: 0, hourMax: 23 });

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    iqamahMethod: "fixed" | "offset"
  ) => {
    setIsFixed(iqamahMethod);
  };

  useEffect(() => {
    setPrayerToEdit(prayer);
    if (isIqamahClicked) {
      setMinMaxTime({
        hourMin: prayer.adhan.getHours(),
        hourMax: addHours(prayer.adhan, 3).getHours()
      });
    } else {
      setMinMaxTime({
        hourMin: addHours(prayer.trueAdhan, -2).getHours(),
        hourMax: addHours(prayer.trueAdhan, 2).getHours()
      });
    }


  }, [prayer, isIqamahClicked]);

  const onPrayerUpdate = async (e: PrayerTimeUpdate) => {
    setLoading(true);
    const { data, error } = await apiPost<PrayerTimeUpdate, { message: string }>("prayers/prayertime", e);
    if (data) {
      checkForUpdate();
      handleClose();
    }
    showPopup({
      message: data ? data.message : error || "Error during updating prayer time",
      type: data ? "success" : "error"
    });
    setLoading(false);
  };

  const currentTime = isIqamahClicked ? prayerToEdit?.iqamah : prayerToEdit?.adhan;

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" textAlign="center" mb={1.2}>
          {`${t('PrayerEditModalTitle', {
            prayer: t(prayerToEdit?.name),
            time: isIqamahClicked ? t('Iqamah') : t('Adhan')
          })}`}
        </Typography>

        <Container sx={{ display: "flex", justifyContent: "space-evenly", mb: 1 }}>
          <ToggleButtonGroup
            color="primary"
            exclusive
            onChange={handleChange}
            value={isFixed}
            disabled={prayerToEdit.name === "Jummuah"}
          >
            <ToggleButton value="fixed">{t("Fixed")}</ToggleButton>
            <ToggleButton disabled={!isIqamahClicked && prayer.name !== "Isha"} value="offset">
              {t("Offset")}
            </ToggleButton>
          </ToggleButtonGroup>
        </Container>

        <Container sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
          {isFixed === "offset" ? (
            <TextField
              label={t("Minutes")}
              type="number"
              value={
                isIqamahClicked ? prayerToEdit?.iqamah_offset ?? 0 : prayerToEdit?.adhan_offset ?? 0
              }
              onChange={(e) =>
                setPrayerToEdit({
                  ...prayerToEdit,
                  newPrayerTime: null,
                  [isIqamahClicked ? "iqamah_offset" : "adhan_offset"]: Number(e.target.value)
                })
              }
            />
          ) : (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileTimePicker
                ampm={false}
                value={currentTime ?? undefined}
                label={isIqamahClicked ? t("Iqamah Time") : t("Adhan Time")}
                onChange={(newValue) => {
                  setPrayerToEdit({
                    ...prayerToEdit,
                    [isIqamahClicked ? "iqamah" : "adhan"]: newValue
                  });
                }}
                sx={{
                  '& .MuiInputBase-input': { textAlign: 'center' }
                }}
                shouldDisableTime={(timeValue, clockType) => {
                  if (clockType === 'hours' && prayer.name !== "Jummuah") {
                    const hour = timeValue.getHours();
                    const { hourMin, hourMax } = minMaxTime;

                    if (hourMin > hourMax) {
                      return !(hour >= hourMin || hour <= hourMax);
                    } else {
                      return !(hour >= hourMin && hour <= hourMax);
                    }
                  }
                  return false;
                }}
              />
            </LocalizationProvider>
          )}

          <Button
            onClick={() =>
              onPrayerUpdate({
                mosqueID,
                prayerID: prayer.prayerID,
                newPrayerTime: null,
                offset: null,
                isIqamah: isIqamahClicked
              })
            }
            sx={{ mt: 1 }}
            size="small"
            variant="text"
          >
            {isIqamahClicked ? t("DeleteIqamahTime") : t("ResetAdhanBackToOriginalTime")}
          </Button>
        </Container>

        <Typography textAlign="center" my={1} color="text.secondary">
          {isIqamahClicked
            ? isFixed === "offset"
              ? t("TheNewIqamahTimeWillAddMinutesFromAdhanTimeAuto")
              : t("FixedIqamahTimeWillFixedTheTimeUntilChange")
            : `${t("ActualAdhanTime")}: ${format(prayer.trueAdhan, "HH:mm")}`}
        </Typography>

        <Container sx={{ display: "flex", justifyContent: "space-evenly", mt: 2 }}>
          <Button variant="outlined" size="large" onClick={handleClose}>
            {t("Cancel")}
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() =>
              onPrayerUpdate({
                mosqueID,
                prayerID: prayer.prayerID,
                newPrayerTime:
                  isFixed === "fixed"
                    ? format(
                      isIqamahClicked ? prayerToEdit.iqamah : prayerToEdit.adhan,
                      "HH:mm"
                    )
                    : null,
                offset:
                  isFixed === "offset"
                    ? isIqamahClicked
                      ? prayerToEdit.iqamah_offset
                      : prayerToEdit.adhan_offset
                    : null,
                isIqamah: isIqamahClicked
              })
            }
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t("Update")}
          </Button>
        </Container>
      </Box>
    </Modal>
  );
}
