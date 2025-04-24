import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { PrayerType } from '../types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { apiPost } from '../utils/api';
import { addHours, endOfDay, endOfToday, format, isToday } from 'date-fns';
import { usePopup } from '../hooks/PopupContext';
import { useUpdate } from '../hooks/UpdateContext';
import { min } from 'lodash';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 1.6,


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
}



export default function PrayerEditModal({ prayer, mosqueID, openModal, handleClose, isIqamahClicked }: PrayerModalProps) {
  const { showPopup } = usePopup()
  const [prayerToEdit, setPrayerToEdit] = useState<any>(prayer)
  const [loading, setLoading] = useState<boolean>(false)
  const [isFixed, setIsFixed] = useState<"fixed" | "offset">(isIqamahClicked ? prayer.iqamahMode || "fixed" : "fixed")
  const { t } = useTranslation();
  const { checkForUpdate } = useUpdate();
  const [minMaxTime, setMinMaxTime] = useState<{ [key: string]: number }>({ hourMin: 0, hourMax: 24 })

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    iqamahMethod: "fixed" | "offset",
  ) => {
    setIsFixed(iqamahMethod);
  };

  useEffect(() => {
    setPrayerToEdit(prayer)

    if (isIqamahClicked) {
      setMinMaxTime({
        hourMin: prayer.adhan.getHours(),
        hourMax: addHours(prayer.adhan, 2).getHours()
      })
    } else {
      setMinMaxTime({
        hourMin: addHours(prayer.trueAdhan, -2).getHours(),
        hourMax: addHours(prayer.trueAdhan, 2).getHours()
      })

    }

  }, [prayer])



  const onPrayerUpdate = async (e: PrayerTimeUpdate) => {
    console.log(e)
    setLoading(true)
    const { data, error } = await apiPost<PrayerTimeUpdate, { message: string }>("prayers/prayertime", e)
    if (data) {
      checkForUpdate()
      handleClose()
    }
    showPopup({ message: data ? data.message : error || "Error during updating prayer time", type: data ? "success" : "error" })
    setLoading(false)

  }


  const handleTimeUpdate = () => {



  }


  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box borderRadius={5} maxWidth={"90%"} sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h6" textAlign={"center"} mb={1.2}>
          {`${t('PrayerEditModalTitle', { prayer: t(prayerToEdit?.name), time: isIqamahClicked ? t('Iqamah') : t('Adhan') })}`}
        </Typography>

        <Container sx={{ display: "flex", justifyContent: "space-evenly", mb: 1 }}>
          <ToggleButtonGroup
            color="primary"
            exclusive
            aria-label="Platform"
            onChange={handleChange}
            value={isFixed}
          >
            <ToggleButton value="fixed">{t("Fixed")}</ToggleButton>
            <ToggleButton disabled={!isIqamahClicked && prayer.name !== "Isha"} value="offset">{t("Offset")}</ToggleButton>
          </ToggleButtonGroup>
        </Container>

        <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
          {isFixed === "offset" ? <TextField
            id="outlined-number"
            label={t("Minutes")}
            type="number"
            value={isIqamahClicked ? prayerToEdit.iqamah_offset : prayerToEdit.adhan_offset}
            onChange={(e) => {
              setPrayerToEdit({ ...prayerToEdit, newPrayerTime: null, iqamahOffset: Number(e.target.value) })
            }}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
            : <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileTimePicker
                value={isIqamahClicked ? prayerToEdit?.iqamah : prayerToEdit?.adhan}
                ampm={false}

                label={isIqamahClicked ? t("Iqamah Time") : t("Adhan Time")}
                onChange={(newValue) => {
                  setPrayerToEdit({ ...prayerToEdit, [isIqamahClicked ? "iqamah" : "adhan"]: newValue })
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    textAlign: 'center'  // Centers the text inside the input field
                  }
                }}

                // This disables hours outside of 9PM (21) to 2:59AM (2)
                shouldDisableTime={(timeValue, clockType) => {
                  if (clockType === 'hours') {
                    const hour = timeValue.getHours();
                    if (minMaxTime.hourMin > minMaxTime.hourMax) {
                      return hour >= minMaxTime.hourMin || hour <= minMaxTime.hourMax ? false : true;
                    } else if (minMaxTime.hourMin < minMaxTime.hourMax) {
                      return hour >= minMaxTime.hourMin && hour <= minMaxTime.hourMax ? false : true;
                    }
                  } else if (clockType === 'minutes') {
                    const minute = timeValue.getMinutes();
                    return minute < minMaxTime.minutesMin || minute > minMaxTime.minutesMax ? true : false;
                  }
                  return false;
                }}



              />
            </LocalizationProvider>}

          {<Button onClick={e => onPrayerUpdate({ mosqueID, prayerID: prayer.prayerID, newPrayerTime: null, offset: null, isIqamah: isIqamahClicked })} sx={{ mt: 1 }} size="small" variant="text">{isIqamahClicked ? t("DeleteIqamahTime") : t("ResetAdhanBackToOriginalTime")}</Button>}

        </Container>

        {isIqamahClicked ? isFixed === "offset" ?
          <Typography textAlign={"center"} my={1} color='text.secondary'>
            {`${t("TheNewIqamahTimeWillAddMinutesFromAdhanTimeAuto")}`}
          </Typography> :
          <Typography textAlign={"center"} my={1} color='text.secondary'>
            {`${t("FixedIqamahTimeWillFixedTheTimeUntilChange")}`}
          </Typography>
          : <Typography textAlign={"center"} my={1} color='text.secondary'>
            {`${t("ActualAdhanTime")}: ${format(prayer.trueAdhan, "HH:mm")}`}
          </Typography>

        }

        <Container sx={{ display: "flex", justifyContent: "space-evenly", mt: 2 }}>
          <Button variant="outlined" size="large" onClick={handleClose}>{t("Cancel")}</Button>
          <Button loading={loading} onClick={() => onPrayerUpdate({ mosqueID, prayerID: prayer.prayerID, newPrayerTime: isFixed === "fixed" ? isIqamahClicked ? format(prayerToEdit.iqamah, "HH:mm") : format(prayerToEdit.adhan, "HH:mm") : null, offset: isFixed === "fixed" ? null : prayerToEdit.iqamahOffset, isIqamah: isIqamahClicked })} variant="contained" size="large">{t("Update")}</Button>
        </Container>
      </Box>
    </Modal>
  );
}