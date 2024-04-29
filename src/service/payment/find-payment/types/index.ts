export interface PaymentFindI {
    order_id: number;
    user_id?: number;
    payment_method: string;
    street: string;
    number: number;
    cep: string;
    city: string;
    state: string;
    created_at?: Date;
    payment_pix?: PaymentPix[];
}

interface PaymentPix {
    id: number;
    order_id: number;
    payment_id: number;
    issuer_id: string;
    notification_url: string;
    qr_code: string;
    ticket_url?: string;
    transaction_amount: number;
    status: string;
    status_detail: string;
    date_approved?: Date;
    currency: string;
    coupon: string | null;
    discount: number | null;
    freight_type: string | null;
    freight_amount: number | null;
    date_of_expiration: Date;
    date_created?: Date;
}
