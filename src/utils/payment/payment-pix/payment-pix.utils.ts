import { PaymentPixM } from "../../../database/models/payment/payment-pix/payment-pix.model";
import { createPaymentPixOrderProps, createPaymentPixOrderRes } from "./types";

async function createPaymentPixOrder({
  order_id,
  data_info_pix,
}: createPaymentPixOrderProps): Promise<createPaymentPixOrderRes> {
  try {
    if (!order_id) {
      return {
        data: {
          msg: "The field order_id is required",
          order_id: null,
          status: 401,
        },
      };
    }

    await PaymentPixM.create({
      order_id,
      ...data_info_pix,
    });

    return {
      data: {
        msg: "Payment added to payment with pix orders",
        order_id: order_id,
        status: 201,
      },
    };
  } catch (error: any) {
    return {
      data: {
        msg:
          error.message ||
          "An error occurred while creating the payment with pix order",
        order_id: order_id,
        status: 500,
      },
    };
  }
}

export { createPaymentPixOrder };
