require("dotenv").config();
import { Request, Response } from "express";
import { UserM } from "../../../models/user/user.model";
import { VerifyCoupon } from "../../../utils/verify-coupon";
import { createOrder } from "../../../utils/payment/create-order/create-order.util";
import { createProductOrder } from "../../../utils/payment/product-order/product-order.utils";
import { UserI } from "../../../interfaces/user.interface";
import { processPix } from "../../../service/payment/process-pix/process-pix.service";
import { createPaymentPixOrder } from "../../../utils/payment/payment-pix/payment-pix.utils";
import { MPPixResponseData } from "../../../service/payment/process-pix/types";
import { processCard } from "../../../service/payment/process.card/payment-card.service";
import { VerifyCard } from "../../../utils/verify-card";
import { createPaymentCardOrder } from "../../../utils/payment/payment-card/payment-card.utils";

("http://localhost:3000/checkout/approve/credit_card/3/1322342309");
/*
 ** add coupon and status of order na tabela orders
 ** arrumar a parada no coupon de quantity * price
 */

async function ControllerCard(req: Request, res: Response) {
  const {
    user_id,
    card_id,
    coupon,
    products,
    address_id,
    payment_method,
    installments,
  } = req.body;

  try {
    const verify_card = await VerifyCard({ card_id, user_id });

    if (verify_card.data.status !== 200) {
      return res.status(verify_card.data.status).json(verify_card.data.msg);
    }

    const ids: number[] = products?.map((product: any) => product.id) || [];
    const verify_coupon = await VerifyCoupon({
      code: coupon,
      ids,
      cart_products: products,
    });

    if (verify_coupon.data.status !== 200) {
      return res.status(verify_coupon.data.status).json(verify_coupon.data.msg);
    }

    const order = await createOrder({
      address_id,
      payment_method,
      user_id,
    });
    if (order.data.status !== 201) {
      return res.status(order.data.status).json(order.data.msg);
    }

    const product_order = await createProductOrder({
      order_id: order.data.order_id!,
      products,
      user_id,
    });
    if (product_order.data.status !== 201) {
      return res.status(product_order.data.status).json(product_order.data.msg);
    }

    const user = (await UserM.findByPk(user_id)) as UserI;
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { data: processedCard } = await processCard({
      card: verify_card.data.card!,
      email: user.email,
      installments: installments || 1,
      withDiscount: verify_coupon.data.withDiscount || null,
      withoutDiscount: verify_coupon.data.withoutDiscount!,
      coupon: verify_coupon.data.code || null,
      discount: verify_coupon.data.discount || null, 
      freight_type: "SEDEX",
      freight_amount: 0.00,
    });
    if (processedCard.status !== 201) {
      return res.status(processedCard.status).json(processedCard.msg);
    }

    const createdPaymentCardOrder = await createPaymentCardOrder({
      order_id: order.data.order_id!,
      data_info_card: processedCard.payment!,
    });
    if (createdPaymentCardOrder.data.status !== 201) {
      return res
        .status(createdPaymentCardOrder.data.status)
        .json({ msg: createdPaymentCardOrder.data.msg });
    }

    return res.status(201).json({
      msg: "Successfull",
      order_id: order.data.order_id,
      payment_id: processedCard.payment?.payment_id,
    });
  } catch (err: any) {
    res.status(400).json({ err: err.message });
  }
}

async function ControllerPix(req: Request, res: Response) {
  const { user_id, coupon, products, address_id, payment_method } = req.body;
  const ids: number[] = products?.map((product: any) => product.id) || [];

  const token = process.env.ACCESS_TOKEN;
  if (!token) {
    return res.status(500).json({ msg: "Public token is not defined!" });
  }

  try {
    const verify_data = await VerifyCoupon({
      code: coupon,
      ids,
      cart_products: products,
    });
    if (verify_data.data.status !== 200) {
      return res.status(verify_data.data.status).json(verify_data.data.msg);
    }
    
    const user: UserI | null = (await UserM.findByPk(user_id)) as UserI | null;
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const order = await createOrder({
      address_id,
      payment_method,
      user_id
    });
    if (order.data.status !== 201) {
      return res.status(order.data.status).json(order.data.msg);
    }

    const product_order = await createProductOrder({
      order_id: order.data.order_id!,
      products,
      user_id,
    });
    if (product_order.data.status !== 201) {
      return res.status(product_order.data.status).json(product_order.data.msg);
    }

    const processedPix = await processPix({
      cpf: user.cpf || "",
      email: user.email || "",
      fullname: user.fullname || "",
      token,
      coupon: verify_data.data.code || null,
      discount: verify_data.data.discount || null, 
      freight_type: "SEDEX",
      freight_amount: 0.00,
      withDiscount: verify_data?.data?.withDiscount || null,
      withoutDiscount: verify_data?.data?.withoutDiscount!,
    });
    
    if (processedPix.data.status !== 201) {
      return res.status(processedPix.data.status).json(processedPix.data.msg);
    }

    const data_info_pix: MPPixResponseData = processedPix.data
      .response as MPPixResponseData;

    const createdPaymentPixOrder = await createPaymentPixOrder({
      order_id: order.data.order_id!,
      data_info_pix,
    });

    if (createdPaymentPixOrder.data.status !== 201) {
      return res
        .status(createdPaymentPixOrder.data.status)
        .json({ msg: createdPaymentPixOrder.data.msg });
    }

    return res.status(201).json({
      msg: "Successfull",
      order_id: order.data.order_id,
      payment_id: data_info_pix.payment_id,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error processing payment" });
  }
}

export { ControllerPix, ControllerCard };
