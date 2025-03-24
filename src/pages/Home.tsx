import { Container, Typography } from "@mui/material";
import PrayerTable from "../components/PrayerTable";
import PrayerDate from "../components/PrayerDate";
import CustomCard from "../components/CustomCard";
import ToolsBar from "../components/ToolsBar";



export default function Home() {

  return (
    <>
      <Typography variant="h4" sx={{ marginTop: 3 }}>
        Tools
      </Typography>
      <ToolsBar />
      <Typography variant="h4" sx={{ marginTop: 3 }}>
        News
      </Typography>

      <CustomCard />

    </>


  );
}

;
