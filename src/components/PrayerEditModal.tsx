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
    openModal:boolean;
    prayer: PrayerType;
    isIqamahClicked:boolean;
    handleClose: () => void; 
    onUpdate: (prayer:PrayerType | undefined) => void;

  }

export default function PrayerEditModal({prayer, openModal, handleClose, isIqamahClicked, onUpdate}:PrayerModalProps) {
const [prayerToEdit,setPrayerToEdit] = useState<PrayerType>(prayer)
const { t } = useTranslation();



  return (
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box borderRadius={5} maxWidth={"90%"} sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h3" textAlign={"center"} mb={3}>
          {`${t('Editing')} ${t(prayerToEdit?.name)} ${isIqamahClicked ? t('Iqamah') : t('Adhan')}`}
          </Typography>
          <Container sx={{display:"flex" , justifyContent:"center", mb:3 ,textAlign:"center"}}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileTimePicker  
          value={isIqamahClicked?prayerToEdit?.iqamah:prayerToEdit?.adhan}  
          ampm={false} 
          label={isIqamahClicked?"Iqamah Time":"Adhan Time"}
          sx={{ 
        '& .MuiInputBase-input': {
          textAlign: 'center'  // Centers the text inside the input field
        }}}
        minTime={isIqamahClicked?prayer?.adhan:new Date()}
      />
          </LocalizationProvider>
          </Container>

          <Container sx={{display:"flex",justifyContent:"space-evenly"}}>
          <Button variant="outlined" size="large" onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>onUpdate(prayerToEdit)}  variant="contained" size="large">{t("Update")}</Button>
          </Container>
        </Box>
      </Modal>
  );
}