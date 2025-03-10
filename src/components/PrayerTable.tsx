import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableFooter, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import ProgressBar from './ProgressBar';
import {  PrayerType  } from '../types';
import { format } from 'date-fns';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  interface PrayerTableProps {
    prayersToShow: Array<PrayerType>; // assuming `prayer` is a type you've defined
    onPrayerTimeClick: (prayer: PrayerType,isIqamahClicked:boolean) => void; 
    children:React.ReactElement;
  }

export default function PrayerTable({prayersToShow,onPrayerTimeClick, children}:PrayerTableProps) {
  return (
    <TableContainer  component={Paper}>
      {children}
      <Table sx={{ flex:1 }} size="medium"  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Prayer</TableCell>
            <Tooltip title="Time of the adhan">

            <TableCell align="center">Adhan</TableCell>
            </Tooltip>
            <TableCell  align="center">Iqamah</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prayersToShow.map((prayer) => (
             prayer.name !== "jummuah"?
            <StyledTableRow key={prayer.name} >
            <StyledTableCell component="th" scope="row">
            {prayer.name}
            </StyledTableCell>
            <StyledTableCell  onClick={()=>onPrayerTimeClick(prayer,false)}  align="center">{format(prayer.adhan,"HH:mm")}</StyledTableCell >
            <StyledTableCell onClick={()=>onPrayerTimeClick(prayer,true)}  align="center">{format(prayer.iqamah,"HH:mm")}</StyledTableCell >
            </StyledTableRow>
             :
             <StyledTableRow key={"jummuah"}>
             <StyledTableCell component="th" scope="row" colSpan={3} sx={{textAlign:"center"}}>
               {`Jummuah Prayer is fixed at ${format(prayer.iqamah,"HH:mm") }`}
             </StyledTableCell>
             </StyledTableRow>

          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

