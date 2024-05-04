import Cookies from "cookies";
import { Request, Response } from "express";
import { changeEmail } from "../../../../service/user/user.service";

async function toChange(req: Request, res: Response) {
  const { change } = req.query;
  const cookies = new Cookies(req, res);
  const codeCookie = cookies.get(change as string) as string | undefined;

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
   return res.status(changed.status).json({ msg: changed.msg });
  }

  return res.status(200).json({ msg: "to-change", cookieData });
}

export { toChange };
