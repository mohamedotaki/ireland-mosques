import PrayerTable from "../components/PrayerTable";
import PrayerDate from "../components/PrayerDate";
import HadithCard from "../components/HadithCard";
import { calculatePrayerProgress, prayersCalc } from "../services/PrayersCalc/Prayers";
import { useCallback, useEffect, useState } from "react";
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
  const { defaultMosque: mosque } = useUpdate()
  const [prayersDate, setPrayerDate] = useState<Date>(new Date())
  const [prayerNotification, setPrayerNotification] = useState<{ [key: string]: boolean }>(getFromLocalDB(LocalStorageKeys.PrayerNotifications))
  const [prayersData, setPrayersData] = useState<PrayersCalcType>(prayersCalc(mosque, prayersDate))
  const [modalData, setModalData] = useState<ModalProps>({ showModal: false, prayer: undefined, isIqamahClicked: false })
  const [mosqueInfoOpen, setMosqueInfoOpen] = useState<boolean>(false)
  const [compassOpen, setCompassOpen] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(prayersData.percentage)
  const [timeLeftToNextPrayer, setTimeLeftToNextPrayer] = useState<string>(prayersData.timeLeft)

  useEffect(() => {
    let newCountUp = prayersData.countUp.duration;
    let newCountDown = prayersData.countDown.duration;
    const timer = setInterval(() => {
      newCountDown -= 1
      newCountUp += 1
      const { percentage, timeLeft } = calculatePrayerProgress(newCountUp, newCountDown)
      percentage >= 100 && setPrayersData(prayersCalc(mosque, prayersDate))
      setProgress(prevProgress => {
        const newProgress = percentage;
        // Only update state if progress has changed significantly
        return newProgress !== prevProgress ? newProgress : prevProgress;
      });
      setTimeLeftToNextPrayer(timeLeft)
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [prayersData, mosque, prayersDate]);


  useEffect(() => {
    setPrayersData(prayersCalc(mosque, prayersDate))
  }, [prayersDate, mosque]);




  const handleOpenModal = useCallback((prayer: PrayerType, isIqamahClicked: boolean) => {
    setModalData({ showModal: true, prayer, isIqamahClicked })
  }, [])
  const handleCloseModal = useCallback(() => {
    setModalData({ showModal: false, prayer: undefined, isIqamahClicked: false })
  }, [])
  const handleCompassOpen = useCallback(() => {
    setCompassOpen(true)
  }, [])
  const handleInfoModalOpen = useCallback(() => {
    setMosqueInfoOpen(true)
  }, [])

  const handleNotificationChange = useCallback((prayerName: string) => {
    setPrayerNotification(prev => {
      const updatedNotification = { ...prev, [prayerName]: !prev[prayerName] };
      // Save to local storage with the latest updated state
      saveToLocalDB(LocalStorageKeys.PrayerNotifications, updatedNotification);
      return updatedNotification;
    });
  }, []);



  /*   const onInfoClick = () => {
      setMosqueInfoOpen(true)
    } */


  return (
    <>
      <NotificationManager todaysPrayers={prayersData.prayers.today} notificationsSettings={prayerNotification} />
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

      {modalData?.prayer &&
        <PrayerEditModal
          prayer={modalData?.prayer}
          handleClose={handleCloseModal}
          openModal={modalData?.showModal}
          mosqueID={mosque.id}
          isIqamahClicked={modalData?.isIqamahClicked}
        />
      }{
        mosqueInfoOpen && <MosqueInfoModal
          mosqueInfo={mosque}
          openModal={mosqueInfoOpen}
          handleClose={() => setMosqueInfoOpen(false)}
        />
      }

      {
        compassOpen && <CompassModal
          openModal={compassOpen}
          handleClose={() => setCompassOpen(false)}
        />
      }



    </>


  );
}
;


