import { Container, IconButton, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { addDays, formatDate } from "date-fns";
import moment from 'moment-hijri';
import { memo } from 'react';


interface PrayerDateType {
  date: Date;
  updateDate: (date: Date) => void;

}

const PrayerDate = memo(({ date, updateDate }: PrayerDateType) => {
  console.log("date rendering")
  return (
    <Container sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly", mb: 1, mt: 1, width: "100%" }}>
      <IconButton onClick={() => updateDate(addDays(date, -1))}>
        <ArrowLeftIcon fontSize="large" />
      </IconButton>
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

        <Typography
          noWrap
          sx={{


          }}
        >
          {formatDate(date, "dd/MMMM/yyyy")}
        </Typography>
        <Typography
          noWrap
          sx={{
            direction: 'rtl',  // Set text direction to RTL for Arabic
          }}
        >
          {moment(date).format('iDD/iMMMM/iYYYY')
          }
        </Typography>
      </Container>
      <IconButton onClick={() => updateDate(addDays(date, 1))}>
        <ArrowRightIcon fontSize="large" />
      </IconButton>
    </Container>

  );

})

export default PrayerDate;
