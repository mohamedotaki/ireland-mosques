export interface ApiResponse<T> {
    data: T;
    status: number;
  }

  export type PrayerType= {
      name: string;
      adhan: Date;
      iqamah: Date;  
  }


export type prayerDatabaseType ={
    id:number;
    prayer_name: string;
    adhan_time: Date;
    adhan_locked:boolean;
    iquamh_time: Date;
    iquamh_offset:number;
}


// Define the enum as shown before
enum mosque_status {
Active ='Active',
Pending ='Pending',
Blocked='Blocked',
inactive='inactive'
}

export type mosquesDatabaseType ={
  id:number;
  name:string;
  address:string;
  eircode:string;
  location:string;
  contact_number:number;
  website:string;
  latitude:number;
  longitude:number;
  iban:string;
  prayers:Array<prayerDatabaseType>
}