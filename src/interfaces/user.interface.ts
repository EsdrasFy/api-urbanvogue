import { Model } from "sequelize";
export interface UserI extends Model<any, any> {
  user_id: number;
  google_id: string;
  facebook_id: number;
  github_id: string;
  fullname: string;
  username: string;
  email: string;
  verify_email: boolean;
  profile_img: string;
  password_hash: string;
  date_of_birth: Date;
  phone: string;
  verify_phone: boolean;
  gender: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
}
