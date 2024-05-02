import { UserM } from "../../../database/models/user/user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
require("dotenv").config();
import { isValidEmail } from "../../../service/user/user.service";
import { SetCode } from "../../../utils/cookies/set-code.utils";
import { HtmlRecoveryPassword } from "../../../constants/html";
import { SendEmailHTML } from "../../../utils/email/email.utils";
import Cookies from "cookies";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET as string;

async function sendEmail(req: Request, res: Response) {
  const { email } = req.params;

  const existingUser = await isValidEmail({ email });

  if (!existingUser) {
    return res
      .status(404)
      .json({ msg: "User with this email does not exist." });
  }

  const code = await SetCode({ req, res });

  const html = HtmlRecoveryPassword(code);
  const success = await SendEmailHTML({ email, html });

  if (!success) {
    return res
      .status(500)
      .json({ msg: "Error sending the code to your email." });
  }

  return res.status(201).json({ msg: "A code has been sent to your email." });
}

async function sendCode(req: Request, res: Response) {
  const { code, email } = req.params;
  const cookies = new Cookies(req, res);
  const realCode = cookies.get("code");
  if (!realCode) {
    return res.status(401).json({ msg: "Expired code!" });
  }
  if (code !== realCode || !code) {
    return res.status(401).json({ msg: "Incorrect code!" });
  }

  const tokenRecovery = jwt.sign({ email }, secret, {
    expiresIn: "5m",
  });

  cookies.set("tokenRecovery", tokenRecovery, {
    httpOnly: true,
    maxAge: 5 * 60 * 1000,
    path: "/",
  });

  cookies.set("code", code, {
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
  const tokenRecovery = cookies.get("tokenRecovery");
  const { password } = req.body;

  if (!tokenRecovery) {
    return res.status(401).json({ msg: "Expired code!" });
  }

  if (!password) {
    return res.status(401).json({ msg: "Enter a correct password!" });
  }

  jwt.verify(
    tokenRecovery,
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
      cookies.set("tokenRecovery", "a", {
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

export { resetPassword, sendEmail, sendCode };
