import { Container, IconButton, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useEffect, useState } from 'react';
import { addDays, formatDate } from "date-fns";
import moment from 'moment-hijri';
import { StaticDatePicker } from '@mui/x-date-pickers';


export default function PrayerDate() {
const [date,setDate] = useState<Date>(new Date())
const [hijriDate,setHijriDate ] = useState<string>("")

useEffect(()=>{
  setHijriDate(moment(date).format('iDD/iMMMM/iYYYY'))
},[date])



  return (
    <Container sx={{display:"flex",alignItems:"center", justifyContent:"space-evenly", mb:1,mt:1, width:"100%"}}>
    <IconButton onClick={()=> setDate(addDays(date,-1))}>
    <ArrowLeftIcon fontSize="large"/>
    </IconButton>
<Container sx={{display:"flex", flexDirection:"column" , alignItems:"center"}}>

    <Typography
            noWrap
            component="text"
            sx={{
              

            }}
          >
            {formatDate(date,"dd/MMMM/yyyy")}
          </Typography>
    <Typography
            noWrap
            component="text"
            sx={{
              direction: 'rtl',  // Set text direction to RTL for Arabic
            }}
          >
            { hijriDate 
            }
          </Typography>
    </Container>
    <IconButton onClick={()=> setDate(addDays(date,1))}>
    <ArrowRightIcon fontSize="large" />
    </IconButton>
    </Container>

  );
}
