import { Request, Response } from "express";
require("dotenv").config();

export async function SetCode({
  req,
  res,
  name,
  data,
  user_id,
}: {
  req: Request;
  res: Response;
  name: string;
  data: string;
  user_id: number;
}): Promise<string> {
  let number = Math.floor(Math.random() * 1000000);
  let code = number.toString().padStart(6, "0");

  res.cookie(name, JSON.stringify({ code, data, user_id }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 300000,
  });

  return code;
}
