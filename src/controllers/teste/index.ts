import { Request, Response } from "express";
import { PaymentM } from "../../models/payment/payment.model";
import { createOrder } from "../../utils/payment/create-order/create-order.util";
import { createProductOrder } from "../../utils/payment/product-order/product-order.utils";

async function createUserOrder(req: Request, res: Response) {
  const { user_id, payment_method, address_id, products } = req.body;

  const { data } = await createOrder({ address_id, payment_method, user_id });
  const data2 = await createProductOrder({ order_id: data.order_id!, products ,user_id});
  res.status(201).json(data);
}

export { createUserOrder };
