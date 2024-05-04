import { UserM } from "../../../database/models/user/user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
require("dotenv").config();
import Cookies from "cookies";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET as string;



async function receiveEmail(req: Request, res: Response) {
  const { code, email } = req.body;
  const cookies = new Cookies(req, res);
  const realCode = cookies.get("forgot_password");
  if (!realCode) {
    return res.status(401).json({ msg: "Expired code!" });
  }
  if (code !== realCode || !code) {
    return res.status(401).json({ msg: "Incorrect code!" });
  }

  const passwordRecoveryCode = jwt.sign({ email }, secret, {
    expiresIn: "5m",
  });

  cookies.set("passwordRecoveryCode", passwordRecoveryCode, {
    httpOnly: true,
    maxAge: 5 * 60 * 1000,
    path: "/",
  });

  cookies.set("forgot_password", code, {
    httpOnly: true,
    maxAge: 1,
    path: "/",
  });

  return res
    .status(200)
    .json({ msg: "Your code has been validated, go to the next step." });
}

async function resetPassword(req: Request, res: Response) {
  const cookies = new Cookies(req, res);
  const passwordRecoveryCode = cookies.get("passwordRecoveryCode");
  const { password } = req.body;

  if (!passwordRecoveryCode) {
    return res.status(401).json({ msg: "Expired code!" });
  }

  if (!password) {
    return res.status(401).json({ msg: "Enter a correct password!" });
  }

  jwt.verify(
    passwordRecoveryCode,
    secret,
    async (err: jwt.VerifyErrors | null, decodedToken: any) => {
      if (err) {
        return res
          .status(403)
          .json({ msg: "Token expired, please try again." });
      }
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      const { email } = decodedToken;
      await UserM.update(
        { password_hash: passwordHash },

        { where: { email: email } }
      );
      cookies.set("passwordRecoveryCode", "a", {
        httpOnly: true,
        maxAge: 1,
        path: "/",
      });
      return res
        .status(200)
        .json({ msg: "Password changed successfully, come back and log in" });
    }
  );
}

export { resetPassword, receiveEmail };
