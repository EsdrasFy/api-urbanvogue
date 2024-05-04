import Cookies from "cookies";
import { NextFunction, Request, Response } from "express";
import { SendEmailWithCode } from "../utils/send/email/send-email.utils";

async function forgotPasswordMiddle(req: Request, res: Response, next: NextFunction) {
  const cookies = new Cookies(req, res);

  const codeForgot = cookies.get("code_forgot");
  if (codeForgot) {
    return next();
  }
  const action = "forgot_password";

 

  next();
}

export {forgotPasswordMiddle};
