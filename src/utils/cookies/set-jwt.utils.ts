import { Request, Response } from "express";
require("dotenv").config();
import jwt from "jsonwebtoken";

export async function SetJwt({
  id,
  req,
  res
}: {
  id: string | number;
  req: Request;
  res: Response;
}) {
  const secret = process.env.SECRET as string;
  const token = jwt.sign({ id }, secret, {
    expiresIn: "24h",
  });

  req.body.jwt = token;

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 300000,
  });

  return;
}
