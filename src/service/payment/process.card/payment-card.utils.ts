require("dotenv").config();
import { CardI } from "../../../interfaces/card.interface";
import axios from "axios";
import { Payment, MercadoPagoConfig } from "mercadopago";
import { v4 as uuidv4 } from "uuid";
import { MPCardResponse } from "./types";

const access_token = process.env.ACCESS_TOKEN || " ";
if (!access_token) {
  console.log("Public token is not defined!");
}

const client = new MercadoPagoConfig({
  accessToken: access_token,
});
const pay = new Payment(client);

interface tokenCreateRes {
  data: {
    msg: string | null;
    status: number;
    token: any | null;
  };
}

async function tokenCreate({
  card,
  withoutDiscount,
  withDiscount,
  installments,
}: {
  card: CardI;
  withoutDiscount: number;
  withDiscount: number | null;
  installments: number;
}): Promise<tokenCreateRes> {
  if (!card) {
    return {
      data: {
        msg: "Withour data card",
        status: 401,
        token: null,
      },
    };
  }
  const month = card?.expiration_date.split("/")[0];
  const year = card?.expiration_date.split("/")[1];
  const number = card?.card_number.split(" ").join("");

  try {
    const cardData = {
      card_number: number,
      cardholder: {
        name: card?.name_holder,
        identification: {
          type: "CPF",
          number: card.cpf_holder,
        },
      },
      expiration_month: month,
      expiration_year: "20" + year,
      security_code: card?.cvv,
      transaction_amount: withDiscount || withoutDiscount,
      installments: installments || 1,
    };

    const response = await axios.post(
      "https://api.mercadopago.com/v1/card_tokens",
      cardData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!response.data || !response.data.id) {
      return {
        data: {
          msg: "Error in create token",
          status: 401,
          token: null,
        },
      };
    }

    return {
      data: {
        msg: "Successfull",
        status: 201,
        token: response.data.id,
      },
    };
  } catch (error: any) {
    return {
      data: {
        msg: error.message || "Error in create token",
        status: 401,
        token: null,
      },
    };
  }
}

interface processCardRes {
  data: {
    msg: string;
    status: number;
    payment: MPCardResponse | null;
  };
}

async function processCard({
  card,
  installments,
  withDiscount,
  withoutDiscount,
  email,
}: {
  card: CardI;
  withoutDiscount: number;
  withDiscount: number | null;
  installments: number;
  email: string;
}): Promise<processCardRes> {
  
  const {
    data: { msg, status, token },
  } = await tokenCreate({
    card,
    installments,
    withDiscount,
    withoutDiscount,
  });
  try {
    if (!status) {
      return {
        data: {
          msg: "Failed to create payment token",
          payment: null,
          status: status,
        },
      };
    }

    const response = await pay.create({
      body: {
        transaction_amount: Number(withDiscount || withoutDiscount),
        token: token,
        description: "Buy product in Urban Vogue",
        installments: Number(installments) | 1,
        payment_method_id: "master",
        notification_url: "https://eoe0dc9qtr0leec.m.pipedream.net",

        payer: {
          email: email,
          identification: {
            type: "CPF",
            number: card.cpf_holder,
          },
        },
      },
      requestOptions: { idempotencyKey: uuidv4() },
    });
    const res: MPCardResponse = {
      payment_id: response.id!,
      issuer_id: response.issuer_id!,
      transaction_amount: response.transaction_amount!,
      installments: response.installments!,
      installment_amount: response.transaction_details?.installment_amount || response.transaction_amount!,
      cpf_holder: response.card?.cardholder?.identification?.number!,
      name_holder: response.card?.cardholder?.name!,
      last_digits: response.card?.last_four_digits!,
      expiration_month: response.card?.expiration_month!,
      expiration_year: response.card?.expiration_year!,
      status: response.status!,
      status_detail: response.status_detail!,
      date_approved: new Date(response.date_approved!),
      currency: response.currency_id!,
      date_created: new Date(response.date_created!),
      date_of_expiration: new Date(response.date_of_expiration!),
    };

    if (response.status !== "approved") {
      return {
        data: {
          msg: response.status_detail || response.status || "Card is invalid!",
          payment: null,
          status: 401,
        },
      };
    }
    return {
      data: {
        msg: "Successfully",
        status: 201,
        payment: res,
      },
    };
  } catch (error: any) {
    console.log(error);

    return {
      data: {
        msg: error.message || "error",
        payment: null,
        status: error.status || 400,
      },
    };
  }
}

export { tokenCreate, processCard };
