
export type UserSignupType = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
}


export type UserType = {
  userID: number;
  name: string;
  userType: "User" | "Admin" | "Owner";
  account_status: 'Active' | 'Pending' | 'Blocked' | 'inactive';
  email: string;
  createdAt: Date;
  lastSignin: Date;
  modified_on: Date;
}