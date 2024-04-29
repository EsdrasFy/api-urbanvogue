import { Request, Response } from "express";
import { PaymentM } from "../../../models/payment/payment.model";
import { isValidUserId } from "../../../service/user/user.service";
import { ProductOrderM } from "../../../models/payment/product-order/product-order.model";
import { PaymentPixM } from "../../../models/payment/payment-pix/payment-pix.model";
import { PaymentCardM } from "../../../models/payment/payment-card/payment-card.model";

async function getOrders(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    const existingUser = await isValidUserId({ user_id: +id });
    if (existingUser) {
      const data = await PaymentM.findAll({
        where: {
          user_id: id,
        },
      });
      return res.status(200).json({ orders: data });
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } else {
    return res.status(401).json({ mdg: "Parameter ID is required!" });
  }
}

async function getOrderDetails(req: Request, res: Response) {
  const { user_id, order_id } = req.params;

  const data = await PaymentM.findOne({
    where: {
      user_id: user_id,
      order_id: order_id,
    },
    include: [
      {
        model: ProductOrderM,
        as: "product_orders",
      },
      {
        model: PaymentPixM,
        as: "payment_pix",
      },
      {
        model: PaymentCardM,
        as: "payment_card",
      },
    ],
  });
  
  res.status(200).json({order: data});
}
export { getOrders, getOrderDetails };
