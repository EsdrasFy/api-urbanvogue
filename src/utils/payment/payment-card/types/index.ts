import { MPCardResponse } from "../../../../service/payment/process.card/types";

export interface createPaymentCardOrderRes {
  data: {
    status: number;
    msg: string;
    order_id: number | null;
  };
}

export interface createPaymentCardOrderProps {
  data_info_card: MPCardResponse;
  order_id: number;
}
