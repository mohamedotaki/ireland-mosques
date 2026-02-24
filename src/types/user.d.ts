
export type UserSignupType = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
}


export type UserType = {
  name: string;
  userType: "User" | "Admin" | "Owner";
  account_status: 'Active' | 'Pending' | 'Blocked' | 'inactive';
  createdAt: Date;
  lastSignin: Date;
  modified_on: Date;
  mosqueID: number;
}


export type ActiveUsersType = {
  day: string;
  week: string;
  month: string;
  year: string;
  allTime: string
}
