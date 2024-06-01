import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import {
  GetGithubOAuthTokens,
  GetGithubUser,
} from "../../../service/oauth/oauth-github/oauth-github.service";
import { GithubUserResult } from "../../../service/user/types";
import { UserM } from "../../../database/models/user/user.model";
import { UserI } from "../../../interfaces/user.interface";
import {
  CreateUser,
  createNotification,
} from "../../../service/user/user.service";

const OAuthGithub = async (req: Request, res: Response) => {
  const success = process.env.OAUTH_SUCCESS_URL as string;
  const secret = process.env.SECRET as string;

  const { code } = req.query;
  if (!code) {
    throw new Error("Dont have code");
  }

  try {
    const accessToken = await GetGithubOAuthTokens({ code: code as string });

    const {
      name: fullname,
      avatar_url: profile_img,
      id: github_id,
      login,
    }: GithubUserResult | undefined = await GetGithubUser({
      accessToken,
    });

    const exisitingUserGithub: UserI | null = (await UserM.findOne({
      where: {
        github_id: github_id,
      },
    })) as UserI | null;

    let token: string;

    if (exisitingUserGithub) {

      token = jwt.sign({ ...exisitingUserGithub.dataValues }, secret, {
        expiresIn: "24h",
      });

    } else {

      const createdUser: UserI | null = await CreateUser({
        fullname,
        profile_img,
        github_id: String(github_id),
        username: login,
      });

      token = jwt.sign({ ...createdUser.dataValues }, secret, {
        expiresIn: "24h",
      });

    }

    res
      .cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24h
      })
      .redirect(success || "http://localhost:3000");
      
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { OAuthGithub };
