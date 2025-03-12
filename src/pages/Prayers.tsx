import PrayerTable from "../components/PrayerTable";
import PrayerDate from "../components/PrayerDate";
import HadithCard from "../components/HadithCard";
import { prayersCalc } from "../services/PrayersCalc/Prayers";
import { useState } from "react";
import PrayerEditModal from "../components/PrayerEditModal";
import { PrayerType } from "../types";
import ProgressBar from "../components/ProgressBar";


interface ModalProps {
 showModal: boolean; 
 prayer:PrayerType | undefined;
 isIqamahClicked:boolean;
}


export default function Prayers() {
const [prayersData,setPrayersData] = useState(prayersCalc())
const [modalData,setModalData] = useState<ModalProps>( {showModal:false,prayer:undefined,isIqamahClicked:false})

const handleOpenModal =(prayer:PrayerType,isIqamahClicked:boolean)=>{
  setModalData({showModal:true,prayer,isIqamahClicked})
}
const handleCloseModal =()=>{
  setModalData({showModal:false,prayer:undefined,isIqamahClicked:false})
}

const onPrayerUpdate=()=>{

}
 
  return (
    <>
    <PrayerDate/>
    <PrayerTable 
   
    prayersToShow={prayersData.prayers.today} 
    onPrayerTimeClick={handleOpenModal}><ProgressBar/></PrayerTable>
    <HadithCard/>
    
    {/* Popups */}
   {modalData?.prayer&& <PrayerEditModal 
    prayer={modalData?.prayer} 
    handleClose={handleCloseModal} 
    openModal={modalData?.showModal} 
    isIqamahClicked={modalData?.isIqamahClicked}
    onUpdate={onPrayerUpdate}
    />
  }

    
    </>
   

  );
}

;
