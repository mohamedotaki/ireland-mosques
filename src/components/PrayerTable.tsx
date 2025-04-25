import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { PrayerType } from '../types';
import { format, isEqual } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { memo, useEffect, useRef, useState } from 'react';
import { getFromLocalDB, LocalStorageKeys } from '../utils/localDB';
import { useAuth } from '../hooks/AuthContext';
import { UserType } from '../types/authTyps';
/* import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'; */
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { usePopup } from '../hooks/PopupContext';

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
  prayersToShow: Array<PrayerType>; // assuming `prayer` is a type you've defined
  onPrayerTimeClick: (prayer: PrayerType, isIqamahClicked: boolean) => void;
  mosqueID: number;
  prayersNotifications: { [key: string]: boolean }
  handleNotificationToggle: (prayerName: string) => void;

}

const PrayerTable = memo(({ prayersToShow, onPrayerTimeClick, mosqueID, prayersNotifications, handleNotificationToggle }: PrayerTableProps) => {
  const { user } = useAuth()
  const allowedUserTypes: UserType["userType"][] = ["Owner", "Admin"];
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar" || i18n.language === "ud"
  const is24hFormat = getFromLocalDB(LocalStorageKeys.AppSettings)?.timeFormatIs24H ? "HH:mm" : "hh:mm"
  const [tooltip, setTooltip] = useState<number | null>(null)
  const isClickable = allowedUserTypes.includes(user?.userType) && user?.mosqueID === mosqueID
  const tooltipRef = useRef<HTMLTableCellElement | null>(null);
  const { showPopup } = usePopup()


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setTooltip(null);
      }
    };

    if (tooltip !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tooltip]);

  const handlePrayerTimeClick = (prayer: PrayerType, isIqamahClicked: boolean) => {
    if (isClickable) {
      if (prayer.adhan_locked && !isIqamahClicked) {
        return showPopup({ message: "You don't have permission to edit this adhan time.", type: "info" })
      }
      onPrayerTimeClick(prayer, isIqamahClicked);
    } else {
      setTooltip(prayer.prayerID)
    }
  };



  return (
    <TableContainer component={Paper} sx={{ direction: isArabic ? "rtl" : "ltr", borderRadius: "0 0 5px 5px" }}>
      <Table sx={{ flex: 1 }} size="medium" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align={isArabic ? "right" : "left"}>{t("Prayer")}</TableCell>

            <TableCell align="center">{t("Adhan")}</TableCell>
            <TableCell align="center">{t("Iqamah")}</TableCell>
            {/*             <TableCell align="center"></TableCell>
 */}
          </TableRow>
        </TableHead>
        <TableBody>
          {prayersToShow.map((prayer) => (
            prayer.name !== "jummuah" ?
              <StyledTableRow key={prayer.name} >
                <StyledTableCell component="th" scope="row" align={isArabic ? "right" : "left"}>
                  {t(prayer.name)}
                </StyledTableCell>
                {!isEqual(prayer.adhan, prayer.trueAdhan) ?
                  <Tooltip
                    open={tooltip === prayer.prayerID}
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, -25],
                            },
                          },
                        ],
                      },
                    }}
                    slots={{
                      transition: Zoom,
                    }} placement="top" title={format(prayer.trueAdhan, is24hFormat)} arrow>
                    <StyledTableCell
                      ref={tooltip === prayer.prayerID ? tooltipRef : null}
                      sx={{ color: (theme) => theme.palette.warning.main }} onClick={() => handlePrayerTimeClick(prayer, false)} align="center" >{format(prayer.adhan, is24hFormat)} </StyledTableCell >
                  </Tooltip> :

                  <StyledTableCell onClick={() => handlePrayerTimeClick(prayer, false)} align="center" >{format(prayer.adhan, is24hFormat)} </StyledTableCell >
                }

                <StyledTableCell onClick={() => handlePrayerTimeClick(prayer, true)} align="center">{prayer.iqamah ? format(prayer.iqamah, is24hFormat) : '-'}</StyledTableCell >
                {/*  <StyledTableCell style={{ padding: "1px" }} onClick={() => handleNotificationToggle(prayer.name)} align="center">
                  {prayersNotifications[prayer.name] ?
                    <NotificationsIcon sx={{ fontSize: "20px" }} /> :
                    <NotificationsOffIcon sx={{ fontSize: "20px" }} />}
                </StyledTableCell >
 */}
              </StyledTableRow>
              :
              <StyledTableRow key={"jummuah"}>
                <StyledTableCell component="th" scope="row" colSpan={3} sx={{ textAlign: "center" }}>

                  {prayer.iqamah ? `Jummuah Prayer is fixed at ${format(prayer.iqamah, is24hFormat)}` : t('Jummuah Iqamah Is Not Set')}
                </StyledTableCell>
              </StyledTableRow>

          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
})



export default PrayerTable;