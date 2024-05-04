import { NextFunction, Request, Response } from "express";
import Cookies from "cookies";
import { compareCredential } from "../service/user/user.service";
import { SetJwt } from "../utils/cookies/set-jwt.utils";
require("dotenv").config();

async function credentialMiddle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cookies = new Cookies(req, res);
  const tokenjwt = cookies.get("jwt");
  if (tokenjwt) {
    return next();
  }
  try {
    const id = await compareCredential(req, res);
    await SetJwt({ id, req, res });
    next();
    
  } catch (error: any) {
    return res
      .status(401)
      .json({ msg: error.message || "Credentials Invalid" });
  }
}

export { credentialMiddle };
