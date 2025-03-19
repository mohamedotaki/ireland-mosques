import {
  toDate,
  addDays,
  addHours,
  addMinutes,
  getYear,
  getMonth,
  getDate,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  isWithinInterval,
  differenceInSeconds,
} from "date-fns";
import timetable from "./TimeTable.json";
import settings from "./Settings.json";
import { apiGet } from "../../utils/api";
import { getFromLocalDB, LocalStorageKeys } from "../../utils/localDB";
import findClosestMosque from "../../utils/findClosestMosque";
import { mosquesDatabaseType, prayerDatabaseType, PrayersCalcType, PrayerType } from "../../types/index";

const isDST = function (d: Date) {
  const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
  return Math.max(jan, jul) !== d.getTimezoneOffset();
};

/* function timeToFloat(time) {
  // Split the time string into hours and minutes
  const [hours, minutes] = time.split(":").map(Number);

  // Convert minutes to a fraction of an hour
  const minutesAsFraction = minutes / 60;

  // Add the fraction to the hours
  return hours + minutesAsFraction;
} */

/* const dateToHHMM = (date:Date) => {
  if (typeof date !== "string") {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  } else {
    return date;
  }
};

function HHMMToDate(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number); // Split the adhan and convert to numbers
  const now = new Date(); // Get the current date

  // Set the hours and minutes based on the timeString
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(0); // Optional: set seconds to 0 if you want to ignore them
  now.setMilliseconds(0); // Optional: set milliseconds to 0 if you want to ignore them

  return now;
} */


const getOnlinePrayers = async () => {
  const onlineData = await apiGet(`${true}/${true}`)
  console.log(onlineData)
}

const dayCalc = (
  offsetDay: number = 0,
  offSetHour: number = 0,
  hijrioffset: number = 0,
  city: string = "Europe/Dublin",
  nowDate: Date = new Date()
) => {
  const now = addHours(nowDate, offSetHour + offsetDay * 24);
  const month = getMonth(now);
  const date = getDate(now);

  const hijri = addDays(now, hijrioffset);
  const start = startOfDay(now);
  const end = endOfDay(now);

  const dstAdjust = isDST(now) ? 1 : 0;

  return { now, month, date, start, end, hijri, dstAdjust };
};

/* const storePrayerData =(prayerData)=>{
  localStorage.setItem('prayerData', JSON.stringify(prayerData));
} */

const prayerCalc = (
  hourMinute: Array<number>,
  hourMinuteNext: Array<number>,
  onlineData: prayerDatabaseType | undefined,
  index: number,
  now: Date,
  when: any,
  jamaahmethods: Array<string>,
  jamaahoffsets: Array<Array<number>>,
  dstAdjust: any
) => {
  let [hour, minute] = hourMinute;
  const [hourNext, minuteNext] = hourMinuteNext;
  let iqamah = null;

  if (onlineData) {
    if (onlineData.adhan_time) {
      const onlineAdhan = onlineData?.adhan_time?.split(":")
      hour = Number(onlineAdhan[0])
      minute = Number(onlineAdhan[1])
    }
  }


  let adhan = addHours(
    toDate(new Date(getYear(now), getMonth(now), getDate(now), hour, minute)),
    dstAdjust
  );


  /*   switch (null) {
      case "useOffset":
        iqamah = addMinutes(adhan, minuteOffset);
        break;
      case "fixed":
        iqamah = toDate(
          new Date(
            getYear(now),
            getMonth(now),
            getDate(now),
            hourOffset,
            minuteOffset
          )
        );
        break;
      default:
        iqamah = adhan;
    } */

  // if iqamah before adhan / ie. summer adhan
  if (iqamah && isBefore(iqamah, adhan)) {
    adhan = iqamah;
  }

  /* *********************** */
  /* NAMES                   */
  /* *********************** */
  const names = ["Fajr", "Shurooq", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const name = names[index];
  const hasPassed = isAfter(now, adhan);
  /*   const isJamaahPending = isWithinInterval(now, { start: adhan, end: iqamah });
   */
  const isNext = false;

  const result = {
    adhan,
/*     isJamaahPending,
 */    iqamah,
    /*     index,
     */   /*  hasPassed, */
    name,
    /*     when,
     */   /*  dstAdjust, */
    isNext,
  };
  return result;
};

const prayersCalc = (
  mosque: mosquesDatabaseType,
  dateToShow: Date = new Date(),
  showJamaah: boolean = true,
  city: string = "Europe/Dublin", // user Current location
): PrayersCalcType => {
  const { hijrioffset, jamaahmethods, jamaahoffsets } = settings;
  const { now, month, date, start, hijri, dstAdjust } = dayCalc(
    0,
    0,
    0,
    city,
    dateToShow
  );
  const {
    now: nowTomorrow,
    month: monthTomorrow,
    date: dateTomorrow,
    dstAdjust: dstAdjustTomorrow,
  } = dayCalc(1, 0, hijrioffset, city, dateToShow);



  /* *********************** */
  /* SET PRAYERS             */
  /* *********************** */

  type TimetableProbes = {
    [month: string]: {
      [date: string]: number[][];
    };
  };

  const prayersTable: TimetableProbes = timetable

  const prayersToday = prayersTable[(month + 1).toString()][date.toString()].map((hourMinute: Array<number>, index: number) => {
    let useAdjust = true;
    const hourMinuteNext =
      index < 5 ? prayersTable[(month + 1).toString()][date.toString()][index + 1] : [24, 0];


    return prayerCalc(
      hourMinute,
      hourMinuteNext,
      mosque?.prayers[index],
      index,
      now,
      "today",
      jamaahmethods,
      jamaahoffsets,
      useAdjust ? dstAdjust : 0
    );
  });

  /* const prayersTomorrow = timetable[monthTomorrow + 1][dateTomorrow].map(
    (hourMinute, index) => {
      const hourMinuteNext =
        index < 5 ? timetable[month + 1][date][index + 1] : [24, 0];
      return prayerCalc(
        hourMinute,
        hourMinuteNext,
        index,
        nowTomorrow,
        "tomorrow",
        jamaahmethods,
        jamaahoffsets,
        dstAdjustTomorrow
      );
    }
  ); */

  /* *********************** */
  /* PREVIOUS, CURRENT, NEXT */
  /* *********************** */
  /*  let current;
  let next;
  let previous;

  if (isWithinInterval(now, { start, end: prayersToday[0].adhan })) {
     previous = prayersYesterday[4];
    current = prayersYesterday[5]; 
    next = prayersToday[0];
  } else if (
    isWithinInterval(now, {
      start: prayersToday[0].adhan,
      end: prayersToday[1].adhan,
    })
  ) {
        previous = prayersYesterday[5];
      current = prayersToday[0];
    next = prayersToday[1];
  } else if (
    isWithinInterval(now, {
      start: prayersToday[1].adhan,
      end: prayersToday[2].adhan,
    })
  ) {
    previous = prayersToday[0];
    current = prayersToday[1];
    next = prayersToday[2];
  } else if (
    isWithinInterval(now, {
      start: prayersToday[2].adhan,
      end: prayersToday[3].adhan,
    })
  ) {
    previous = prayersToday[1];
    current = prayersToday[2];
    next = prayersToday[3];
  } else if (
    isWithinInterval(now, {
      start: prayersToday[3].adhan,
      end: prayersToday[4].adhan,
    })
  ) {
    previous = prayersToday[2];
    current = prayersToday[3];
    next = prayersToday[4];
  } else if (
    isWithinInterval(now, {
      start: prayersToday[4].adhan,
      end: prayersToday[5].adhan,
    })
  ) {
    previous = prayersToday[3];
    current = prayersToday[4];
    next = prayersToday[5];
  } else {
    previous = prayersToday[4];
    current = prayersToday[5];
    next = prayersTomorrow[0];
  } */

  /* *********************** */
  /* COUNTDOWN/UP            */
  /* *********************** */
  /*   const countUp = {
    name:
      current?.isJamaahPending || !showJamaah
        ? current.name
        : `${current.name}${current.index !== 1 ? " jamaah" : ""}`,
    time:
      current?.isJamaahPending || !showJamaah ? current.adhan : current.iqamah,
    duration:
      current?.isJamaahPending || !showJamaah
        ? differenceInSeconds(now, current.adhan)
        : differenceInSeconds(now, current.iqamah),
  };

  const countDown = {
    name:
      current?.isJamaahPending && showJamaah
        ? `${current.name}${current.index !== 1 ? " jamaah" : ""}`
        : next.name,
    time: current?.isJamaahPending && showJamaah ? current.iqamah : next.adhan,
    duration:
      current?.isJamaahPending && showJamaah
        ? differenceInSeconds(current.iqamah, now) + 1
        : differenceInSeconds(next.adhan, now) + 1,
  };

  const totalDuration = countUp.duration + countDown.duration;

  const percentageRaw = 10000 - (countDown.duration / totalDuration) * 10000;
  const percentage = Math.floor(percentageRaw) / 100;

  const isAfterIsha = isAfter(now, prayersToday[5].iqamah); */
  /*   const isJamaahPending = isWithinInterval(now, {
    start: current.adhan,
    end: current.iqamah,
  });
  const focus = current?.isJamaahPending ? current : next; */

  // focused prayer - add isNext
  /*   if (isAfterIsha) {
    prayersTomorrow[focus.index].isNext = true;
  } else {
    prayersToday[focus.index].isNext = true;
  } */

  // add day if after isha
  /*   const trueNow = now;
  const trueHijri = hijri;
  const newNow = isAfterIsha ? addDays(now, 1) : now;
  const newHijri = isAfterIsha ? addDays(hijri, 1) : hijri; */

  const result = {
    mosque: {
      id: 0,
      name: "Al-Kausar",
      address: "3 Sherwood Ave, Hazelhill, Ballyhaunis, Co. Mayo, Ireland",
      eircode: "F35 DY95",
      location: "Ballyhaunis",
      contact_number: "+353 892201526",
      website: "www.seventhbyte.com",
      latitude: 53.760110570124525,
      longitude: -8.771078816946458,
      iban: "IE28AIBK93744421240194"
    },
    prayers: {
      today: prayersToday,
      /*       tomorrow: prayersTomorrow,
       */
    },
    /*    previous,
    current,
    next,
    countUp,
    countDown,
    now: newNow,
    hijri: newHijri,
    trueNow,
    trueHijri,
    percentage,
    isAfterIsha, */
    /*     isJamaahPending,
     */ /*  focus, */
  };
  return result;
};

export { prayersCalc, dayCalc, getOnlinePrayers };
