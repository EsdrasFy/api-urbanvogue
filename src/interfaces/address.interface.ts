import { Model } from "sequelize";

export interface AddressI extends Model<any, any>{
    address_id: number;
    user_id: number;
    street: string;
    number: number;
    cep: string;
    city: string;
    state: string;
    type_address: string;
    reference?: string;
    createdAt: Date;
}
