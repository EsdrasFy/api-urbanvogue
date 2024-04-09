export interface createPaymentPixOrderRes {
  data: {
    status: number;
    msg: string;
    order_id: number | null;
  };
}

export interface createPaymentPixOrderProps {
  data_info_pix: {
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
  };
  order_id: number;
}
