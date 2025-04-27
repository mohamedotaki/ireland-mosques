export type UserType = {
  userID: number;
  mosqueID: number | null;
  name: string;
  email: string;
  account_status: "Active" | "Inactive" | "Pending";
  userType: "User" | "Admin" | "Owner" | undefined;
  createdAt: Date;
  settings: settingsType
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
  settings: settingsType

}

export type settingsType = {
  language: "en" | "ar" | "ur";
  theme: 'light' | 'dark' | 'system_default';
  fontSize: number;
  timeFormatIs24H: boolean;
  defaultMosque: number | null,

}
