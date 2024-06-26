import { NextFunction, Request, Response } from "express";
import {
  ControllerCard,
  ControllerPix,
} from "../controllers/payment/process/payment-process.controller";
require("dotenv").config();

async function paymentMiddle(req: Request, res: Response, next: NextFunction) {
  const method = req.params.method;

  if (method === "card") {
    return await ControllerCard(req, res);
  }
  if (method === "pix") {
    return await ControllerPix(req, res);
  }

  res.json({ msg: "method invalid" });
}

export { paymentMiddle };
