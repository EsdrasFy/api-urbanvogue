import { PaymentCardM } from "../../../database/models/payment/payment-card/payment-card.model";
import {
  createPaymentCardOrderProps,
  createPaymentCardOrderRes,
} from "./types";

async function createPaymentCardOrder({
  order_id,
  data_info_card,
}: createPaymentCardOrderProps): Promise<createPaymentCardOrderRes> {
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

    await PaymentCardM.create({
      order_id,
      ...data_info_card,
    });

    return {
      data: {
        msg: "Payment added to payment with card orders",
        order_id: order_id,
        status: 201,
      },
    };
  } catch (error: any) {
    console.log(error);
    
    return {
      data: {
        msg:
          error.message ||
          "An error occurred while creating the payment with card order",
        order_id: order_id,
        status: 500,
      },
    };
  }
}

export { createPaymentCardOrder };
