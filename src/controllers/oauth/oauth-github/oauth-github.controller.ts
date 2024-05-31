import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { GetGithubOAuthTokens, GetGithubUser } from '../../../service/oauth/oauth-github/oauth-github.service';
import { GithubUserResult } from '../../../service/user/types';


const OAuthGithub = async (req: Request, res: Response) => {
  const frontBaseUrl = process.env.FRONT_BASE_URL as string;
  const secret = process.env.SECRET as string;

  const { code } = req.query;
  if (!code) {
    throw new Error('Dont have code');
  }

  try {
    const accessToken = await GetGithubOAuthTokens({ code: code as string });

    const {
      name,
      avatar_url: avatar,
      id: githubId,
    }: GithubUserResult | undefined = await GetGithubUser({
      accessToken,
    });

    const token = jwt.sign({ name, avatar, githubId }, secret, {
      expiresIn: '24h',
    });

    return res
      .cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24h
      })
      .redirect(frontBaseUrl || 'http://localhost:3000');
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { OAuthGithub };
