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
import { prayerCalcType, PrayerType } from '../types';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
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
  prayersToShow: Array<prayerCalcType>; // assuming `prayer` is a type you've defined
  onPrayerTimeClick: (prayer: PrayerType, isIqamahClicked: boolean) => void;
  children: React.ReactElement;
}

export default function PrayerTable({ prayersToShow, onPrayerTimeClick, children }: PrayerTableProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar"

  return (
    <TableContainer component={Paper} sx={{ direction: isArabic ? "rtl" : "ltr" }}>
      {children}
      <Table sx={{ flex: 1 }} size="medium" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align={isArabic ? "right" : "left"}>{t("Prayer")}</TableCell>
            <Tooltip title="Time of the adhan">

              <TableCell align="center">{t("Adhan")}</TableCell>
            </Tooltip>
            <TableCell align="center">{t("Iqamah")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prayersToShow.map((prayer) => (
            prayer.name !== "jummuah" ?
              <StyledTableRow key={prayer.name} >
                <StyledTableCell component="th" scope="row" align={isArabic ? "right" : "left"}>
                  {t(prayer.name)}
                </StyledTableCell>
                <StyledTableCell onClick={() => onPrayerTimeClick(prayer, false)} align="center">{format(prayer.adhan, "hh:mm")}</StyledTableCell >
                <StyledTableCell onClick={() => onPrayerTimeClick(prayer, true)} align="center">{prayer.iqamah ? format(prayer.iqamah, "HH:mm") : '-'}</StyledTableCell >
              </StyledTableRow>
              :
              <StyledTableRow key={"jummuah"}>
                <StyledTableCell component="th" scope="row" colSpan={3} sx={{ textAlign: "center" }}>

                  {prayer.iqamah ? `Jummuah Prayer is fixed at ${format(prayer.iqamah, "HH:mm")}` : t('Jummuah Iqamah Is Not Set')}
                </StyledTableCell>
              </StyledTableRow>

          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

