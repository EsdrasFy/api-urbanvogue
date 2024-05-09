import { NextFunction, Request, Response } from "express";
import Cookies from "cookies";
import { GoogleOAuth } from "../utils/oauth/google/google.utils";
import { GithubOAuth } from "../utils/oauth/github/github.utils";
require("dotenv").config();

async function oauthMiddle(req: Request, res: Response, next: NextFunction) {
  const cookies = new Cookies(req, res);
  const provider = req.query.provider;
  const tokenjwt = cookies.get("jwt");
  if (tokenjwt) {
    return next();
  }
  try {
    if (
      provider !== "google" &&
      provider !== "facebook" &&
      provider !== "github"
    ) {
      return res.status(403).json({ msg: "Provider is not defined" });
    }
    if (provider === "google") {
      return await GoogleOAuth(req, res);
    }
    if (provider === "github") {
      return await GithubOAuth(req, res);
    }
   return res.status(200).json({msg: "Teste"})
  } catch (error:any) {
    console.error({error:error.message});
}
}

export { oauthMiddle };
