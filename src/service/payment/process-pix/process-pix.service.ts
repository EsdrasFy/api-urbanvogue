require("dotenv").config();
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { processPixProps, processPixRes } from "./types";
import { MPPixResponse } from "../../../controllers/payment/process/types";

async function processPix({
  email,
  cpf,
  fullname,
  token,
  withDiscount,
  withoutDiscount,
  coupon,
  discount,
  freight_amount,
  freight_type,
}: processPixProps): Promise<processPixRes> {
  try {
    const body = {
      transaction_amount: withDiscount || withoutDiscount,
      token: token,
      description: "",
      payment_method_id: "pix",
      payer: {
        email: email || " ",
        first_name: fullname || " ",
        last_name: " ",
        identification: {
          type: "CPF",
          number: cpf,
        },
      },
      notification_url: "https://eoe0dc9qtr0leec.m.pipedream.net",
      date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };

    const response: MPPixResponse = (await axios.post(
      "https://api.mercadopago.com/v1/payments",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Idempotency-Key": uuidv4(),
        },
      }
    )) as MPPixResponse;

    const res = {
      payment_id: response.data.id,
      issuer_id: response.data.issuer_id,
      notification_url: response.data.notification_url,
      qr_code: response.data.point_of_interaction.transaction_data.qr_code,
      ticket_url:
        response.data.point_of_interaction.transaction_data.ticket_url,
      transaction_amount: response.data.transaction_amount,
      status: response.data.status,
      status_detail: response.data.status_detail,
      date_approved: response.data.date_approved,
      currency: response.data.currency_id,
      date_created: response.data.date_created,
      date_of_expiration: response.data.date_of_expiration,
      coupon:coupon,
      discount: discount, 
      freight_type: freight_type,
      freight_amount: freight_amount,
    };

    return {
      data: {
        msg: "Payment with pix created",
        status: 201,
        response: res,
      },
    };
  } catch (error: any) {
    console.error(error);
    let errorMessage = "Error processing payment";
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      data: {
        msg: errorMessage,
        status: 400,
      },
    };
  }
}

export { processPix };
