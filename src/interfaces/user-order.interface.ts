export interface UserOrderI {
  order_id: number;
  user_id: number;
  payment_method: string;
  street: string;
  number: number;
  cep: string;
  status: string;
  city: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}
