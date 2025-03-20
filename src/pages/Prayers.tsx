import PrayerTable from "../components/PrayerTable";
import PrayerDate from "../components/PrayerDate";
import HadithCard from "../components/HadithCard";
import { prayersCalc } from "../services/PrayersCalc/Prayers";
import { useEffect, useState } from "react";
import PrayerEditModal from "../components/PrayerEditModal";
import { mosquesDatabaseType, PrayersCalcType, PrayerType } from "../types";
import ProgressBar from "../components/ProgressBar";
import findClosestMosque from "../utils/findClosestMosque";
import { getFromLocalDB, LocalStorageKeys } from "../utils/localDB";
import MosqueInfo from "../components/MosqueInfo";
import MosqueInfoModal from "../components/MosqueInfoModal";
import CompassModal from "../components/CompassModal";


interface ModalProps {
  showModal: boolean;
  prayer: PrayerType | undefined;
  isIqamahClicked: boolean;
}


export default function Prayers() {
  const [mosque, setMosque] = useState<mosquesDatabaseType>(getFromLocalDB(LocalStorageKeys.DefaultMosque))
  const [prayersDate, setPrayerDate] = useState<Date>(new Date())
  const [prayersData, setPrayersData] = useState<PrayersCalcType>(prayersCalc())
  const [modalData, setModalData] = useState<ModalProps>({ showModal: false, prayer: undefined, isIqamahClicked: false })
  const [mosqueInfoOpen, setMosqueInfoOpen] = useState<boolean>(false)
  const [compassOpen, setCompassOpen] = useState<boolean>(false)



  /*   useEffect(() => {
      const fetchClosestMosque = async () => {
        const mosquesdb = getFromLocalDB(LocalStorageKeys.MosquesData);
        // find closest mosque to the user
        try {
          const closestMosque = await findClosestMosque(mosquesdb);
          setMosque(closestMosque as mosquesDatabaseType);
        } catch (error) {
          setMosque(await getFromLocalDB(LocalStorageKeys.DefaultMosque));
        }
      };
  
      fetchClosestMosque();
      prayersCalc(mosque)
    }, []) */

  /*   useEffect(() => {
      setPrayersData(prayersCalc(mosque, prayersDate))
    }, [prayersDate, mosque]) */


  const handleOpenModal = (prayer: PrayerType, isIqamahClicked: boolean) => {
    setModalData({ showModal: true, prayer, isIqamahClicked })
  }
  const handleCloseModal = () => {
    setModalData({ showModal: false, prayer: undefined, isIqamahClicked: false })
  }

  const onPrayerUpdate = (e: PrayerType) => {
    e && console.log(e)
  }

  const onInfoClick = () => {
    setMosqueInfoOpen(true)
  }


  return (
    <>
      <PrayerDate date={prayersDate} updateDate={setPrayerDate} />
      <PrayerTable
        prayersToShow={prayersData.prayers.today}
        onPrayerTimeClick={handleOpenModal}>
        <>
          <MosqueInfo mosqueDetails={mosque} handleInfoModalOpen={() => setMosqueInfoOpen(true)} handleCompassOpen={() => setCompassOpen(true)} />
          <ProgressBar />
        </>
      </PrayerTable>
      <HadithCard />

      {/* Popups */}
      {modalData?.prayer &&
        <PrayerEditModal
          prayer={modalData?.prayer}
          handleClose={handleCloseModal}
          openModal={modalData?.showModal}
          isIqamahClicked={modalData?.isIqamahClicked}
          onUpdate={onPrayerUpdate}
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


