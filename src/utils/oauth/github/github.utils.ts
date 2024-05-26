import { Request, Response } from "express";
import {
  CreateUser,
  createNotification,
  getGithubOAuthTokens,
  getGithubUser,
  isValidEmail,
  isValidUsername,
} from "../../../service/user/user.service";
import { GithubUserResult } from "../../../service/user/types";
import { UserI } from "../../../interfaces/user.interface";
import { SetJwt } from "../../cookies/set-jwt.utils";
import dotenv from "dotenv";
dotenv.config();

async function GithubOAuth(req: Request, res: Response): Promise<any> {
  const code: string = req.query.code as string;
  const successOAuth = process.env.OAUTH_SUCCESS_URL as string;
  if (!code) {
    throw new Error("Dont have code");
  }
  const access_token = await getGithubOAuthTokens({ code });
  const user: GithubUserResult | null = await getGithubUser({
    code: access_token,
  });
  if (!user.email) {
    const existingUsername: UserI | null = await isValidUsername({
      username: user.login,
    });

    if (existingUsername) {
      await SetJwt({ id: existingUsername.user_id, req, res });
      res.redirect(successOAuth);
      return;
    }

    const userNew = await CreateUser({
      username: user.login,
      email: user.email,
      fullname: user.name,
      profile_img: user.avatar_url,
      github_id: String(user.id),
      verify_email: true,
    });
    await createNotification({
      user_id: userNew.user_id,
      message:
        "Your data is out of date, please click here or go to your profile and complete the registration.",
      redirect: "/account/edit",
      title: "Incomplete user information!",
    });
    await createNotification({
      user_id: userNew.user_id,
      message:
        "It's a pleasure to have you with us! Enjoy our varieties and always live in urban style.",
      redirect: "",
      title: "Welcome to urban vogue!",
    });
    await SetJwt({ id: userNew.user_id, req, res });

    res.redirect(successOAuth);
    return;
  }

  const existingEmail =
    ((await isValidEmail({ email: user.email! })) as UserI) || null;

  if (existingEmail) {
    await SetJwt({ id: existingEmail.user_id, req, res });
    return res.redirect(successOAuth);
  }

  const existingUsername: UserI | null = await isValidUsername({
    username: user.login,
  });

  const num = (Math.random() * 100000).toFixed(0).padStart(5, "0");

  const userNew = await CreateUser({
    username: existingUsername ? user.login + num : user.login,
    email: user.email,
    fullname: user.name,
    profile_img: user.avatar_url,
    github_id: String(user.id),
    verify_email: true,
  });

  await SetJwt({ id: userNew.user_id, req, res });
  return res.redirect(successOAuth);
  
}

export { GithubOAuth };
