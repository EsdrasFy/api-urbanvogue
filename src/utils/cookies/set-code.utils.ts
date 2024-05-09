import Cookies from "cookies";
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

  const cookies = new Cookies(req, res);
  cookies.set(name, JSON.stringify({ code, data, user_id }), {
    httpOnly: true,
    maxAge: 30 * 60 * 1000,
    path: "/",
  });
  console.log({ name, data, user_id });

  return code;
}
