
export type UserSignupType = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phoneNumber?: string;
}


export type UserType = {
  name: string;
  email: string;
  userType: "User" | "Admin" | "Owner";
  lastSignin?: Date;
}