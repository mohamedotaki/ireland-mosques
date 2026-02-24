export interface ApiResponse<T> {
  data: T;
  status: number;
}

export type PrayerType = {
  prayerID: number;
  name: string;
  trueAdhan: Date;
  adhan: Date;
  iqamah: Date | null;
  adhan_offset: number | null;
  iqamah_offset: number | null;
  iqamahMode: "fixed" | "offset" | null;
  adhan_locked: boolean;
}




export type prayerDatabaseType = {
  id: number;
  prayer_name: string;
  adhan_time: string;
  adhan_locked: boolean;
  iquamh_time: string;
  adhan_offset: number;
  iquamh_offset: number;
  adhan_modified_on: string;
  iquamh_modified_on: string;

}


// Define the enum as shown before
enum mosque_status {
  Active = 'Active',
  Pending = 'Pending',
  Blocked = 'Blocked',
  inactive = 'inactive'
}

export type mosquesDatabaseType = {
  id: number;
  name: string;
  address: string;
  eircode: string;
  location: string;
  contact_number: number;
  website: string;
  latitude: number;
  longitude: number;
  iban: string;
  prayers: Array<prayerDatabaseType>
  time_table: TimetableType;
  ramadan_mode: boolean;
}

export type TimetableType = {
  [month: string]: {
    [date: string]: Array<Array<number>>;
  };
}







export type PrayersCalcType = {
  mosque: MosqueInfoType;
  prayers: {
    today: Array<PrayerType>,
    userSelectedPrayers: Array<PrayerType>
  }
  countUp: {
    duration: number,
    name: string,
    time: Date,
  },
  countDown: {
    duration: number,
    name: string,
    time: Date,
  }
  percentage: number,
  timeLeft: string,
}



export type MosqueInfoType = {
  id: number;
  name: string;
  address: string;
  eircode: string;
  location: string;
  contact_number: string;
  website: string;
  latitude: number;
  longitude: number;
  iban: string;
}


export type PostType = {
  post_id?: number;
  mosque_id?: number;
  create_time?: Date;
  created_by?: number;
  updated_by?: number;
  content: string;
  updated_time?: Date;
}