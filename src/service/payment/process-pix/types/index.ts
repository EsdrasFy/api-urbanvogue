export interface processPixProps {
  email: string;
  cpf: string;
  fullname: string;
  token: string;
  withDiscount: number | null;
  coupon: string | null;
  discount: number | null;
  freight_type: string | null;
  freight_amount: number | null;
  withoutDiscount: number;
}

export interface MPPixResponseData {
  payment_id: number;
  issuer_id: string;
  notification_url: string;
  qr_code: string;
  ticket_url: string;
  transaction_amount: number;
  status: string;
  status_detail: string;
  date_approved: Date | null;
  currency: string;
  date_created: Date | null;
  date_of_expiration: Date | null;
  coupon: string | null;
  discount: number | null;
  freight_type: string | null;
  freight_amount: number | null;
}

export interface processPixRes {
  data: {
    status: number;
    msg: string;
    response?: MPPixResponseData;
  };
}
