import Cookies from "cookies";
import { Request, Response } from "express";
require("dotenv").config();

export async function SetCode({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<string> {
  let number = Math.floor(Math.random() * 1000000);
  let code = number.toString().padStart(6, "0");

  const cookies = new Cookies(req, res);
  cookies.set("code", code, {
    httpOnly: true,
    maxAge: 5 * 60 * 1000,
    path: "/",
  });

  return code;
}
