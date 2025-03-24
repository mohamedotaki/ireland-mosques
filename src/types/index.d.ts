export interface ApiResponse<T> {
  data: T;
  status: number;
}

export type PrayerType = {
  name: string;
  adhan: Date;
  iqamah: Date | null;
}


export type prayerDatabaseType = {
  id: number;
  prayer_name: string;
  adhan_time: string;
  adhan_locked: boolean;
  iquamh_time: string;
  iquamh_offset: number;
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
}


export type PrayersCalcType = {
  mosque: MosqueInfoType;
  prayers: {
    today: Array<prayerCalcType>,
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
}

export type prayerCalcType = {
  adhan: Date,
  iqamah: Date | null,
  name: string,
  isNext: boolean
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