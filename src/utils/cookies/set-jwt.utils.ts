import Cookies from "cookies";
import { Request, Response } from "express";
require("dotenv").config();
import jwt from "jsonwebtoken";

export async function SetJwt({
  id,
  req,
  res,
}: {
  id: string | number;
  req: Request;
  res: Response;
}) {
  const secret = process.env.SECRET as string;
  const cookies = new Cookies(req, res);
  const token = jwt.sign({ id }, secret, {
    expiresIn: "24h",
  });

  req.body.jwt = token;

  cookies.set("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
  });

  return;
}
