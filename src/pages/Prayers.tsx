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
import NotificationManager from "../components/NotificationManager";

interface ModalProps {
  showModal: boolean;
  prayer: PrayerType | undefined;
  isIqamahClicked: boolean;
}

export default function Prayers() {
  const { defaultMosque: mosque } = useUpdate();
  const [prayersDate, setPrayerDate] = useState<Date>(new Date());
  const [prayerNotification, setPrayerNotification] = useState<{ [key: string]: boolean }>(
    getFromLocalDB(LocalStorageKeys.PrayerNotifications)
  );
  const [prayersData, setPrayersData] = useState<PrayersCalcType>(prayersCalc(mosque, prayersDate));
  const [modalData, setModalData] = useState<ModalProps>({ showModal: false, prayer: undefined, isIqamahClicked: false });
  const [mosqueInfoOpen, setMosqueInfoOpen] = useState<boolean>(false);
  const [compassOpen, setCompassOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(prayersData.percentage);
  const [timeLeftToNextPrayer, setTimeLeftToNextPrayer] = useState<string>(prayersData.timeLeft);

  // Refs to hold dynamic durations without triggering re-renders
  const countUpRef = useRef<number>(prayersData.countUp.duration);
  const countDownRef = useRef<number>(prayersData.countDown.duration);

  useEffect(() => {
    const timer = setInterval(() => {
      countDownRef.current -= 1;
      countUpRef.current += 1;

      const { percentage, timeLeft } = calculatePrayerProgress(countUpRef.current, countDownRef.current);

      if (percentage >= 100) {
        const newPrayers = prayersCalc(mosque, prayersDate);
        setPrayersData(newPrayers);
        countUpRef.current = newPrayers.countUp.duration;
        countDownRef.current = newPrayers.countDown.duration;
        return;
      }

      setProgress(prevProgress => (percentage !== prevProgress ? percentage : prevProgress));
      setTimeLeftToNextPrayer(timeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [mosque, prayersDate]); // ✅ Only depends on stable values

  useEffect(() => {
    const newData = prayersCalc(mosque, prayersDate);
    setPrayersData(newData);
    countUpRef.current = newData.countUp.duration;
    countDownRef.current = newData.countDown.duration;
  }, [prayersDate, mosque]);

  const handleOpenModal = useCallback((prayer: PrayerType, isIqamahClicked: boolean) => {
    setModalData({ showModal: true, prayer, isIqamahClicked });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalData({ showModal: false, prayer: undefined, isIqamahClicked: false });
  }, []);

  const handleCompassOpen = useCallback(() => {
    setCompassOpen(true);
  }, []);

  const handleInfoModalOpen = useCallback(() => {
    setMosqueInfoOpen(true);
  }, []);

  const handleNotificationChange = useCallback((prayerName: string) => {
    setPrayerNotification(prev => {
      const updatedNotification = { ...prev, [prayerName]: !prev[prayerName] };
      saveToLocalDB(LocalStorageKeys.PrayerNotifications, updatedNotification);
      return updatedNotification;
    });
  }, []);

  return (
    <>
      {/* <NotificationManager todaysPrayers={prayersData.prayers.today} notificationsSettings={prayerNotification} /> */}
      <PrayerDate date={prayersDate} updateDate={setPrayerDate} />
      <MosqueInfo mosqueDetails={mosque} handleInfoModalOpen={handleInfoModalOpen} handleCompassOpen={handleCompassOpen} />
      <ProgressBar progress={progress} time={timeLeftToNextPrayer} />
      <PrayerTable
        prayersToShow={prayersData.prayers.userSelectedPrayers}
        onPrayerTimeClick={handleOpenModal}
        mosqueID={mosque.id}
        prayersNotifications={prayerNotification}
        handleNotificationToggle={handleNotificationChange}
      />
      <HadithCard />

      {modalData?.prayer && (
        <PrayerEditModal
          prayer={modalData?.prayer}
          handleClose={handleCloseModal}
          openModal={modalData?.showModal}
          mosqueID={mosque.id}
          isIqamahClicked={modalData?.isIqamahClicked}
        />
      )}

      {mosqueInfoOpen && (
        <MosqueInfoModal
          mosqueInfo={mosque}
          openModal={mosqueInfoOpen}
          handleClose={() => setMosqueInfoOpen(false)}
        />
      )}

      {compassOpen && (
        <CompassModal
          openModal={compassOpen}
          handleClose={() => setCompassOpen(false)}
        />
      )}
    </>
  );
}
