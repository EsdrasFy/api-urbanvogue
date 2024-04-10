import { PaymentCardM } from "../../../models/payment/payment-card/payment-card.model";
import { PaymentPixM } from "../../../models/payment/payment-pix/payment-pix.model";
import { PaymentM } from "../../../models/payment/payment.model";
import { PaymentFindI } from "./types";

async function findPaymentPix({
  method,
  order_id,
  payment_id,
}: {
  method: "pix" | "card" | "bank";
  order_id: number;
  payment_id: number;
}): Promise<PaymentFindI | null> {
  try {
    let includeList: any[] = [];

    if (method === "pix") {
      includeList.push({
        model: PaymentPixM,
        as: "payment_pix",
        where: {
          payment_id: payment_id,
        },
      });
    }
    if (method === "card") {
      includeList.push({
        model: PaymentCardM,
        as: "payment_card",
        where: {
          payment_id: payment_id,
        },
      });
    }
    const payments: PaymentFindI | null = (await PaymentM.findOne({
      include: includeList,
      where: {
        order_id: order_id,
      },
    })) as PaymentFindI | null;
    
    return payments;
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error);
    throw error;
  }
}

export { findPaymentPix };
