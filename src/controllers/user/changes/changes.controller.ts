import { Request, Response } from "express";
import { SendEmailWithCode } from "../../../utils/send/email/send-email.utils";
import { SetCode } from "../../../utils/cookies/set-code.utils";
import { sendMessage } from "../../../service/whatsapp-web/whatsapp-web.service";
import { isValidUserId } from "../../../service/user/user.service";

async function UserChanges(req: Request, res: Response) {
  const { change, data, user_id, transport } = req.body;
  const types = ["email", "password", "phone"];

  if (!change || !types.includes(change as string)) {
    return res
      .status(401)
      .json({ msg: "Please include the change field correctly." });
  }

  if (!user_id) {
    return res.status(401).json({ msg: "UserID is required." });
  }

  const existingUser = await isValidUserId({ user_id });

  if (!existingUser) {
    return res.status(404).json({ msg: "User not found." });
  }

  const code = await SetCode({
    req,
    res,
    name: change,
    data: data,
    user_id: +user_id,
  });
  
  const messageSms = `HI! 😃\nTo verify your number, copy and paste the code onto the website. To be safe, do not share it with other people.\n\n *Access code: ${code}*`;

  if (change === "email") {
    if (!data || typeof data !== "string") {
      return res.status(401).json({ msg: "Email is required." });
    }

    const emailSent = await SendEmailWithCode(
      data,
      change,
      code,
      user_id,
      existingUser.user_id
    );

    return res.status(emailSent.status).json({ msg: emailSent.msg });
  }

  if (change === "phone" && transport) {
    let sendCode: { status: number; msg: string } = {
      status: 401,
      msg: "Transport unavailable",
    };
    switch (transport) {
      case "wpp":
        const {
          data: { msg, status },
        } = await sendMessage(data, messageSms);
        sendCode = { status: status, msg: msg };
        break;
      case "sms":
        sendCode = { status: 500, msg: "Service temporarily unavailable" };
        break;
    }

    return res.status(sendCode.status).json({ msg: sendCode.msg });
  }

  if (change === "password" && transport) {
    let sendCode: { status: number; msg: string } = {
      status: 401,
      msg: "Transport unavailable",
    };
    switch (transport) {
      case "email":
        if (!existingUser.email || !existingUser.verify_email) {
          sendCode = {
            msg: "You need to verify or add an email to your account",
            status: 401,
          };
        }

        sendCode = await SendEmailWithCode(
          existingUser.email,
          change,
          code,
          user_id,
          existingUser.user_id
        );
        break;

      case "sms":
        if (!existingUser.phone || !existingUser.verify_phone) {
          sendCode = {
            msg: "You need to verify or add an phone to your account",
            status: 401,
          };
        }

        sendCode = { status: 500, msg: "Service temporarily unavailable" };
        break;
      case "wpp":
        if (!existingUser.phone || !existingUser.verify_phone) {
          sendCode = {
            msg: "You need to verify or add an phone to your account",
            status: 401,
          };
        }
        const {
          data: { msg, status },
        } = await sendMessage(existingUser.phone, messageSms);

        sendCode = { status: status, msg: msg };
        break;
    }

    return res.status(sendCode.status).json({ msg: sendCode.msg });
  }

  return res.status(401).json({ msg: "Invalid change or transport." });
}

export { UserChanges };
