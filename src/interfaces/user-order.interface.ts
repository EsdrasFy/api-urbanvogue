import { Model } from "sequelize";

export interface UserOrderI{
    order_id: number;
    user_id: number;
    payment_method: string;
    street: string;
    number: number;
    cep: string;
    city: string;
    state: string;
    created_at: Date;
}
