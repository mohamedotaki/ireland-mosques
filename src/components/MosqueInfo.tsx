import { Card, IconButton, Typography } from '@mui/material';
import { memo } from 'react';
import { mosquesDatabaseType } from '../types';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
interface PrayerDateType {
  mosqueDetails: mosquesDatabaseType;
  handleInfoModalOpen: () => void;
  handleCompassOpen: () => void;

}

const MosqueInfo = memo(({ mosqueDetails, handleInfoModalOpen, handleCompassOpen }: PrayerDateType) => {
  console.log("mosque info  rendering")
  return (

    <Card sx={{ display: "flex", alignItems: "center", justifyContent: "space-around", width: "100%", py: 1, borderRadius: "5px 5px 0 0" }}>
      <IconButton onClick={undefined}>
        {/*         <InfoOutlinedIcon />
 */}      </IconButton>

      <Typography >
        {`${mosqueDetails.name} - ${mosqueDetails.location}`}
      </Typography>
      <IconButton onClick={handleCompassOpen}>
        <ExploreOutlinedIcon />
      </IconButton>


    </Card>



  );

})

export default MosqueInfo;
