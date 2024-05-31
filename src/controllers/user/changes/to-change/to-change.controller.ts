import { Request, Response } from "express";
import {
  changeEmail,
  changePassword,
  changePhone,
} from "../../../../service/user/user.service";
import bcrypt from "bcrypt";

async function toChange(req: Request, res: Response) {
  const { change } = req.query;
  const codeCookie = req.cookies.get.change;

  let cookieData;
  if (!codeCookie) {
    return res.status(400).json({ msg: "Cookie expired." });
  }

  cookieData = JSON.parse(codeCookie);

  if (change === "email") {
    const changed = await changeEmail({
      email: cookieData.data,
      user_id: +cookieData.user_id!,
    });

    if (changed.status === 200) {
      res.cookie(change, "", { expires: new Date(0), path: "/" });
    }
    return res
      .status(changed.status)
      .json({ msg: changed.msg, email: cookieData.data });
  }

  if (change === "phone") {
    const changed = await changePhone({
      phone: cookieData.data,
      user_id: +cookieData.user_id!,
    });

    if (changed.status === 200) {
      res.cookie(change, "", { expires: new Date(0), path: "/" });
    }
    return res
      .status(changed.status)
      .json({ msg: changed.msg, phone: cookieData.data });
  }

  if (change === "password") {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(cookieData.data, salt);

    const changed = await changePassword({
      password: passwordHash,
      user_id: +cookieData.user_id!,
    });

    if (changed.status === 200) {
      res.cookie(change, "", { expires: new Date(0), path: "/" });
    }

    return res.status(changed.status).json({ msg: changed.msg });
  }
}

export { toChange };
