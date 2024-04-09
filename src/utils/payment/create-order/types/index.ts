export interface createOrderRes {
  data: {
    status: number;
    msg: string;
    order_id: number | null;
  };
}

export interface createOrderProps {
  user_id: number;
  payment_method: string;
  address_id: number;
  coupon?: string | null
}
