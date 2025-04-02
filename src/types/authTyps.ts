export type UserType = {
  userID: number;
  mosqueID: number | null;
  name: string;
  email: string;
  account_status: "Active" | "Inactive" | "Pending";
  user_type: "User" | "Admin" | "Owner";
  createdAt: Date;
};

export type SigninType = {
  email: string;
  password: string;
}


export type SignupType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;


}
