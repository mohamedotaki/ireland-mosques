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
  isAfter,
  isWithinInterval,
  differenceInSeconds,
  format, addSeconds
} from "date-fns";
import settings from "./Settings.json";
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


const prayerCalc = (
  hourMinute: Array<number>,
  hourMinuteNext: Array<number>,
  onlineData: prayerDatabaseType[] | undefined,
  index: number,
  now: Date,
  dstAdjust: number
): PrayerType => {
  let [hour, minute] = hourMinute;
  let [hourNext, minuteNext] = hourMinuteNext;
  let onlineHourAdhan = null
  let onlineMinAdhan = null
  let onlineHourAdhanNext = null
  let onlineMinAdhanNext = null
  let onlineHourIqamah = null
  let onlineMinIqamah = null
  let iqamah = null;
  let prayerID = 0;
  const todaysDate = new Date();
  const names = ["Fajr", "Shurooq", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const name = names[index];

  let adhan = addHours(
    toDate(new Date(getYear(now), getMonth(now), getDate(now), hour, minute)),
    dstAdjust
  );

  let nextAdhan = addHours(
    toDate(new Date(getYear(now), getMonth(now), getDate(now), hourNext, minuteNext)),
    dstAdjust
  );

  if (onlineData) {
    onlineData.forEach((prayer: prayerDatabaseType) => {
      //update next prayer adhan time
      for (let i = 0; i < onlineData.length; i++) {
        if (names[index + 1] === onlineData[i].prayer_name) {
          const nextPrayeModifiedDate = new Date(onlineData[i].adhan_modified_on);
          if (onlineData[i].adhan_time && !onlineData[i].adhan_locked && isWithinInterval(todaysDate, { start: nextPrayeModifiedDate, end: addDays(nextPrayeModifiedDate, 15) })) {
            const onlineAdhan = onlineData[i].adhan_time.split(":")
            onlineHourAdhanNext = Number(onlineAdhan[0])
            onlineMinAdhanNext = Number(onlineAdhan[1])
            nextAdhan = addHours(
              toDate(new Date(getYear(now), getMonth(now), getDate(now), onlineHourAdhanNext, onlineMinAdhanNext)),
              isDST(nextPrayeModifiedDate) ? 0 : dstAdjust
            );
          }
          break
        }
      }

      if (prayer.prayer_name === name) {
        prayerID = prayer.id
        const modifiedDate = new Date(prayer.adhan_modified_on);
        if (prayer.adhan_time && !prayer.adhan_locked && isWithinInterval(todaysDate, { start: modifiedDate, end: addDays(modifiedDate, 15) })) {
          const onlineAdhan = prayer.adhan_time.split(":")
          onlineHourAdhan = Number(onlineAdhan[0])
          onlineMinAdhan = Number(onlineAdhan[1])
          adhan = addHours(
            toDate(new Date(getYear(now), getMonth(now), getDate(now), onlineHourAdhan, onlineMinAdhan)),
            isDST(modifiedDate) ? 0 : dstAdjust
          );
        }
        const iqamahModifiedDate = new Date(prayer.iquamh_modified_on);
        if (prayer.iquamh_time && isWithinInterval(todaysDate, { start: iqamahModifiedDate, end: addDays(iqamahModifiedDate, 15) })) {
          const onlineIqamah = prayer.iquamh_time.split(":")
          onlineHourIqamah = Number(onlineIqamah[0])
          onlineMinIqamah = Number(onlineIqamah[1])
          iqamah = addHours(
            toDate(new Date(getYear(now), getMonth(now), getDate(now), onlineHourIqamah, onlineMinIqamah)),
            isDST(iqamahModifiedDate) ? 0 : dstAdjust
          );

          if (isAfter(adhan, iqamah) ||
            !isWithinInterval(now, { start: addDays(todaysDate, -3), end: addDays(todaysDate, 5) }) ||
            isAfter(iqamah, nextAdhan)) {
            iqamah = null
          }
        } else if (prayer.iquamh_offset && isWithinInterval(todaysDate, { start: iqamahModifiedDate, end: addDays(iqamahModifiedDate, 15) })) {
          iqamah = addMinutes(adhan, prayer.iquamh_offset)
        } else {
          iqamah = null
        }
      }
    })
  }
  const result = {
    prayerID,
    adhan,
    iqamah,
    name,
  };
  return result;
};

const prayersCalc = (
  mosque: mosquesDatabaseType,
  dateToShow: Date = new Date(),
  city: string = "Europe/Dublin", // user Current location
): PrayersCalcType => {
  const todaysDate = new Date();
  const { hijrioffset } = settings;
  const { now, month, date, dstAdjust } = dayCalc(
    0,
    0,
    0,
    city,
    dateToShow
  );
  const {
    now: nowToday,
    month: monthToday,
    date: dateToday,
    start: startToday,
    dstAdjust: dstAdjustToday,
  } = dayCalc(0, 0, hijrioffset, city, todaysDate);
  const {
    now: nowTomorrow,
    month: monthTomorrow,
    date: dateTomorrow,
    dstAdjust: dstAdjustTomorrow,
  } = dayCalc(1, 0, hijrioffset, city, todaysDate);
  const {
    now: nowYesterday,
    month: monthYesterday,
    date: dateYesterday,
    dstAdjust: dstAdjustYesterday,
  } = dayCalc(-1, 0, hijrioffset, city, todaysDate);



  /* *********************** */
  /* SET PRAYERS             */
  /* *********************** */


  const prayersTable = mosque.time_table

  const userPrayerDate = prayersTable[(month + 1).toString()][date.toString()].map((hourMinute: Array<number>, index: number) => {
    const hourMinuteNext =
      index < 5 ? prayersTable[(month + 1).toString()][date.toString()][index + 1] : [24, 0];


    return prayerCalc(
      hourMinute,
      hourMinuteNext,
      mosque?.prayers,
      index,
      now,
      dstAdjust
    );
  });

  /*   prayersToday.push({
      adhan: new Date(),
      iqamah: null,
      name: "jummuah",
    }); */


  const prayersToday = prayersTable[(monthToday + 1).toString()][dateToday.toString()].map((hourMinute: Array<number>, index: number) => {
    const hourMinuteNext =
      index < 5 ? prayersTable[(monthToday + 1).toString()][dateToday.toString()][index + 1] : [24, 0];


    return prayerCalc(
      hourMinute,
      hourMinuteNext,
      mosque?.prayers,
      index,
      nowToday,
      dstAdjustToday
    );
  });


  const prayersTomorrow = prayersTable[monthTomorrow + 1][dateTomorrow].map(
    (hourMinute, index) => {
      const hourMinuteNext =
        index < 5 ? prayersTable[month + 1][date][index + 1] : [24, 0];
      return prayerCalc(
        hourMinute,
        hourMinuteNext,
        mosque?.prayers,
        index,
        nowTomorrow,
        dstAdjustTomorrow
      );
    }
  );
  const prayersYesterday = prayersTable[monthYesterday + 1][dateYesterday].map(
    (hourMinute, index) => {
      const hourMinuteNext =
        index < 5 ? prayersTable[month + 1][date][index + 1] : [24, 0];
      return prayerCalc(
        hourMinute,
        hourMinuteNext,
        mosque?.prayers,
        index,
        nowYesterday,
        dstAdjustYesterday
      );
    }
  );


  /* *********************** */
  /* PREVIOUS, CURRENT, NEXT */
  /* *********************** */
  let current;
  let next;
  let previous;

  if (isWithinInterval(nowToday, { start: startToday, end: prayersToday[0].adhan })) {
    previous = prayersYesterday[4];
    current = prayersYesterday[5];
    next = prayersToday[0];
  } else if (
    isWithinInterval(nowToday, {
      start: prayersToday[0].adhan,
      end: prayersToday[1].adhan,
    })
  ) {
    previous = prayersYesterday[5];
    current = prayersToday[0];
    next = prayersToday[1];
  } else if (
    isWithinInterval(nowToday, {
      start: prayersToday[1].adhan,
      end: prayersToday[2].adhan,
    })
  ) {
    previous = prayersToday[0];
    current = prayersToday[1];
    next = prayersToday[2];
  } else if (
    isWithinInterval(nowToday, {
      start: prayersToday[2].adhan,
      end: prayersToday[3].adhan,
    })
  ) {
    previous = prayersToday[1];
    current = prayersToday[2];
    next = prayersToday[3];
  } else if (
    isWithinInterval(nowToday, {
      start: prayersToday[3].adhan,
      end: prayersToday[4].adhan,
    })
  ) {
    previous = prayersToday[2];
    current = prayersToday[3];
    next = prayersToday[4];
  } else if (
    isWithinInterval(nowToday, {
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
  }

  /* *********************** */
  /* COUNTDOWN/UP            */
  /* *********************** */
  const countUp = {
    name: current.name,
    time: current.adhan,
    duration: differenceInSeconds(nowToday, current.adhan),
  };

  const countDown = {
    name: next.name,
    time: next.adhan,
    duration: differenceInSeconds(next.adhan, nowToday) + 1,
  };



  const { percentage, timeLeft } = calculatePrayerProgress(countUp.duration, countDown.duration)


  const isAfterIsha = isAfter(nowToday, prayersToday[5].adhan);
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
      userSelectedPrayers: userPrayerDate,

    },
    previous,
    current,
    next,
    countUp,
    countDown,
    /*     now: newNow,
        hijri: newHijri, */
    /*     trueNow, */
    /*     trueHijri, */
    percentage,
    timeLeft,
    isAfterIsha,
    /*     isJamaahPending,
     */ /*  focus, */
  };
  return result;
};


const calculatePrayerProgress = (countUp: number, countDown: number) => {
  const totalDuration = countUp + countDown;
  const percentageRaw = 10000 - (countDown / totalDuration) * 10000;
  const percentage = Math.floor(percentageRaw) / 100;
  const time = addSeconds(startOfDay(new Date()), countDown);
  return { percentage, timeLeft: format(time, 'HH:mm:ss') };
};

export { prayersCalc, dayCalc, calculatePrayerProgress };
