import { CardI } from "../../../../interfaces/card.interface";

export interface tokenCreateRes {
  data: {
    msg: string | null;
    status: number;
    token: any | null;
  };
}

export interface tokenCreateProps {
  card: CardI;
  withoutDiscount: number;
  withDiscount: number | null;
  installments: number;
}
export interface processCardProps{
  card: CardI;
  withoutDiscount: number;
  withDiscount: number | null;
  installments: number;
  email: string;
  coupon: string | null;
  discount: number | null;
  freight_type: string | null;
  freight_amount: number | null;
} 

export interface MPCardResponse {
  payment_id: number;
  issuer_id: string;
  transaction_amount: number;
  installments: number;
  installment_amount: number | null;
  cpf_holder: string;
  name_holder: string;
  last_digits: string;
  expiration_month: number;
  expiration_year: number;
  status: string;
  status_detail: string;
  date_approved: Date | null;
  currency: string;
  date_created: Date | null;
  coupon: string | null;
  discount: number | null;
  freight_type: string | null;
  freight_amount: number | null;
  date_of_expiration: Date | null;
}

export interface processCardRes {
  data: {
    msg: string;
    status: number;
    payment: MPCardResponse | null;
    response?: any;
  };
}
