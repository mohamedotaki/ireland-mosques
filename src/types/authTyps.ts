export type user = {
  mosque_id: number | null;
  name: string;
  email: Date;
  user_type: "User" | "Admin" | "Owner";
  last_signin: Date;
}
