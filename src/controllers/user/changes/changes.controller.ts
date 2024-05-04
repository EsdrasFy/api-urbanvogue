import { Request, Response } from "express";
import { changePhone } from "../../../service/changes/change-phone/change-phone.service";
import { SendEmailWithCode } from "../../../utils/send/email/send-email.utils";
import { SetCode } from "../../../utils/cookies/set-code.utils";

async function UserChanges(req: Request, res: Response) {
  const { change, email, user_id } = req.body;
  const types = ["email", "password", "phone"];

  if (!change || !types.includes(change as string)) {
    return res
      .status(401)
      .json({ msg: "Please include the change field correctly." });
  }

  if (!user_id) {
    return res.status(401).json({ msg: "UserID is required." });
  }

  const code = await SetCode({
    req,
    res,
    name: change,
    data: email,
    user_id: +user_id,
  });

  
  if (change === "email") {
    if (!email || typeof email !== "string") {
      return res.status(401).json({ msg: "Email is required." });
    }
    const emailSent = await SendEmailWithCode(email, change, code, user_id);
    return res.status(emailSent.status).json({ msg: emailSent.msg });
  }
  if (change === "phone") {
    return await changePhone(req, res);
  }
  if (change === "password") {
    return await changePhone(req, res);
  }
}
export { UserChanges };
