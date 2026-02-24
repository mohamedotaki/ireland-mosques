import PrayerTable from "../components/PrayerTable";
import PrayerDate from "../components/PrayerDate";
import HadithCard from "../components/HadithCard";
import { calculatePrayerProgress, prayersCalc } from "../services/PrayersCalc/Prayers";
import { useCallback, useEffect, useRef, useState } from "react";
import PrayerEditModal from "../components/PrayerEditModal";
import { PrayersCalcType, PrayerType } from "../types";
import ProgressBar from "../components/ProgressBar";
import { getFromLocalDB, LocalStorageKeys, saveToLocalDB } from "../utils/localDB";
import MosqueInfo from "../components/MosqueInfo";
import MosqueInfoModal from "../components/MosqueInfoModal";
import CompassModal from "../components/CompassModal";
import { useUpdate } from "../hooks/UpdateContext";
import RamadanTimeTable from "./RamadanTimeTable";
import { Grid2 } from "@mui/material";
import Prayers from "./Prayers";
import Home from "./Home";
/* import NotificationManager from "../components/NotificationManager";
 */
interface ModalProps {
  showModal: boolean;
  prayer: PrayerType | undefined;
  isIqamahClicked: boolean;
}

export default function Desktop() {

  return (
    <Grid2 container >
      <Grid2 size={6} p={2}>
        <Home />
      </Grid2>
      <Grid2 size={6} p={2}>
        <Prayers />

      </Grid2>

    </Grid2>
  );
}
