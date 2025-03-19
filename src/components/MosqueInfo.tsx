import { Card, Container, IconButton, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { addDays, formatDate } from "date-fns";
import moment from 'moment-hijri';
import { memo } from 'react';
import { MosqueInfoType, mosquesDatabaseType } from '../types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
interface PrayerDateType {
  mosqueDetails: mosquesDatabaseType;
  handleInfoModalOpen: () => void;

}

const MosqueInfo = memo(({ mosqueDetails, handleInfoModalOpen }: PrayerDateType) => {
  console.log("mosque info  rendering")
  return (

    <Card sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", width: "100%", py: 1 }}>
      <Typography fontWeight={600}>

      </Typography>
      <Typography fontWeight={600}>
        {`${mosqueDetails.name} - ${mosqueDetails.location}`}
      </Typography>
      <IconButton onClick={handleInfoModalOpen}>
        <InfoOutlinedIcon />
      </IconButton>

    </Card>



  );

})

export default MosqueInfo;
