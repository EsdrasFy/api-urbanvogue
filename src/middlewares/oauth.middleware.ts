import { NextFunction, Request, Response } from "express";
import { OAuthGithub } from "../controllers/oauth/oauth-github/oauth-github.controller";

const OAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  if (token) {
    // validar o jwt do cookies
    console.log("Logado: " + token);
    next();
  }

  const { provider } = req.query;

  try {
    if (provider === "google") {
      // return await GoogleOAuth
    }
    if (provider === "github") {
      await OAuthGithub(req, res);
    }
    if (provider === "credentials") {
      // return await CredentialsOAuth
    }

    throw new Error("Invalid Provider");
  } catch (error: any) {
    console.error(error.message);
  }
};

export { OAuth };
