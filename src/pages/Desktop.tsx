import { Grid } from "@mui/material";
import Prayers from "./Prayers";
import Home from "./Home";
import { PrayerType } from "../types";
/* import NotificationManager from "../components/NotificationManager";
 */
interface ModalProps {
  showModal: boolean;
  prayer: PrayerType | undefined;
  isIqamahClicked: boolean;
}

export default function Desktop() {

  return (
    <Grid container >
      <Grid size={6} p={2}>
        <Home />
      </Grid>
      <Grid size={6} p={2}>
        <Prayers />

      </Grid>

    </Grid>
  );
}
