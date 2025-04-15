import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { PrayerTimeUpdate, PrayerType } from '../types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { Container } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { apiPost } from '../utils/api';
import { format } from 'date-fns';
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


};

interface PrayerModalProps {
  openModal: boolean;
  prayer: PrayerType;
  mosqueID: number;
  isIqamahClicked: boolean;
  handleClose: () => void;
}




export default function PrayerEditModal({ prayer, mosqueID, openModal, handleClose, isIqamahClicked }: PrayerModalProps) {
  const { showPopup } = usePopup()
  const [prayerToEdit, setPrayerToEdit] = useState<any>(prayer)
  const [loading, setLoading] = useState<boolean>(false)
  const [isFixed, setIsFixed] = useState<"fixed" | "offset">("fixed")
  const { t } = useTranslation();
  const { checkForUpdate } = useUpdate();

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    iqamahMethod: "fixed" | "offset",
  ) => {
    setIsFixed(iqamahMethod);
  };


  const onPrayerUpdate = async (e: PrayerTimeUpdate) => {
    setLoading(true)
    const { data, error } = await apiPost<PrayerTimeUpdate, { message: string }>("prayers/prayertime", e)
    if (data) {
      checkForUpdate()
    }

    showPopup({ message: data ? data.message : error || "Error during updating prayer time", type: data ? "success" : "error" })
    setLoading(false)

  }


  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box borderRadius={5} maxWidth={"90%"} sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h3" textAlign={"center"} mb={1}>
          {`${t('PrayerEditModalTitle', { prayer: t(prayerToEdit?.name), time: isIqamahClicked ? t('Iqamah') : t('Adhan') })}`}
        </Typography>

        {isIqamahClicked && <Container sx={{ display: "flex", justifyContent: "space-evenly", mb: 1 }}>

          <ToggleButtonGroup
            color="primary"
            exclusive
            aria-label="Platform"
            onChange={handleChange}
            value={isFixed}

          >
            <ToggleButton value="fixed">Fixed</ToggleButton>
            <ToggleButton value="offset">Offset</ToggleButton>
          </ToggleButtonGroup>
        </Container>}
        <Container sx={{ display: "flex", justifyContent: "center", mb: 3, textAlign: "center" }}>
          {isFixed === "offset" ? <TextField
            id="outlined-number"
            label="Number"
            type="number"
            onChange={(e) => {
              setPrayerToEdit({ ...prayerToEdit, iqamahOffset: Number(e.target.value) })
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
                minTime={isIqamahClicked ? prayer?.adhan : new Date()}
              />
            </LocalizationProvider>}
        </Container>

        <Container sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button variant="outlined" size="large" onClick={handleClose}>{t("Cancel")}</Button>
          <Button loading={loading} onClick={() => onPrayerUpdate({ mosqueID, prayerID: prayer.prayerID, newPrayerTime: isFixed === "fixed" ? isIqamahClicked ? format(prayerToEdit.iqamah, "HH:mm") : format(prayerToEdit.adhan, "HH:mm") : null, offset: isFixed === "fixed" ? null : prayerToEdit.iqamahOffset, isIqamah: isIqamahClicked })} variant="contained" size="large">{t("Update")}</Button>
        </Container>
      </Box>
    </Modal>
  );
}