import { Request, Response } from "express";
import {
  CreateUser,
  getGoogleOAuthTokens,
  getGoogleUser,
  isValidEmail,
  isValidUsername,
} from "../../../service/user/user.service";
import { UserI } from "../../../interfaces/user.interface";
import { SetJwt } from "../../cookies/set-jwt.utils";
import { GoogleUserResult } from "../../../service/user/types";
require("dotenv").config();

async function GoogleOAuth(req: Request, res: Response): Promise<any> {
  const code: string = req.query.code as string;
  const successOAuth = process.env.OAUTH_SUCCESS_URL as string;
  if (!code) {
    throw new Error("Dont have code");
  }

  const { id_token, access_token } = await getGoogleOAuthTokens({ code });

  const {
    email,
    given_name: username,
    id,
    name: fullname,
    picture: profile_img,
  }: GoogleUserResult = (await getGoogleUser({
    id_token,
    access_token,
  })) as GoogleUserResult;

  const existingEmail = ((await isValidEmail({ email })) as UserI) || null;
  if (existingEmail) {
    await SetJwt({ id: existingEmail.user_id, req, res });
    return res.redirect(successOAuth);
  }
  const existingUsername: UserI | null = await isValidUsername({ username });

  const num = (Math.random() * 100000).toFixed(0).padStart(5, "0");
  const user = await CreateUser({
    username: existingUsername ? username + num : username,
    email: email,
    fullname,
    profile_img,
    google_id: id,
    verify_email: true,
  });

  
  res.redirect(successOAuth);
  
  await SetJwt({ id: user.user_id, req, res });
  return;
}

export { GoogleOAuth };
