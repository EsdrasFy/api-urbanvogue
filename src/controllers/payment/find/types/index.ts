interface PaymentPixI {
    id: number;
    order_id: number;
    payment_id: number;
    issuer_id: string;
    notification_url: string;
    qr_code: string;
    ticket_url: string | null;
    transaction_amount: number;
    status: string;
    status_detail: string;
    date_approved: string | null;
    currency: string;
    date_of_expiration: string;
    date_created: string;
}

interface ProductOrderI {
    product_order: number;
    order_id: number;
    product_id: number;
    user_id: number;
    color: string;
    title: string;
    price:string;
    image:string;
    size: string;
    quantity: number;
}

interface UserOrderI {
    order_id: number;
    user_id: number;
    payment_method: string;
    street: string;
    number: number;
    cep: string;
    city: string;
    state: string;
    created_at: string;
    payment_pix: PaymentPixI[];
    product_orders: ProductOrderI[];
}

export { UserOrderI, PaymentPixI, ProductOrderI };
