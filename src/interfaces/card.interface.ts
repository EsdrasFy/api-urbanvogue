import { Model } from "sequelize";

export interface CardI extends Model<any, any> {
    card_id: number;
    type: string;
    user_id: number;
    card_number: string;
    card_nickname: string;
    name_holder: string;
    cpf_holder: string;
    card_network: string;
    expiration_date: string;
    cvv: string;
}
