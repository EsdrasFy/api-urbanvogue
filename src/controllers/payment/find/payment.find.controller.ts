import { Request, Response } from "express";
import { findPaymentPix } from "../../../service/payment/find-payment/find-payment.service";

async function findPayment(req: Request, res: Response) {
  const { order_id, payment_id, method } = req.params;
  if (
    method !== "pix" &&
    method !== "card" &&
    method !== "bank"
  ) {
    return res.status(401).json({ msg: "Method invalid" });
  }
  if(!order_id || !payment_id){
    return res.status(401).json({ msg: "The field order_id and payment_id is required!" });    
  }
  const response = await findPaymentPix({
    method,
    order_id: +order_id,
    payment_id: +payment_id,
  });
  if(!response){
    return res.status(404).json({msg: "Parameters invalid!"})
  }
  return res.status(200).json({ response });
}
export { findPayment };
