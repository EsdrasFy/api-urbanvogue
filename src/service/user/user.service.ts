import axios from "axios";
import { Request, Response } from "express";
import { UserM } from "../../database/models/user/user.model";
import { UserI } from "../../interfaces/user.interface";
import bcrypt from "bcrypt";
require("dotenv").config();
import {
  ChangePromise,
  CreateUserData,
  GithubTokensResult,
  GithubUserResult,
  GoogleTokensResult,
  GoogleUserResult,
} from "./types";
import { AddressM } from "../../database/models/user/user-address/user-adress.model";
import { AddressI } from "../../interfaces/address.interface";
import { where } from "sequelize";

export async function CreateUser({
  fullname,
  username,
  ...otherProps
}: CreateUserData): Promise<UserI> {
  try {
    if (!fullname || !username) {
      throw new Error("The username, fullname and fields are mandatory");
    }

    if (username.length < 3) {
      throw new Error(
        "Incorrect user pattern! The username must have at least 3 characters."
      );
    }

    if (fullname.length < 3) {
      throw new Error(
        "Fullname required! The fullname must have at least 10 characters."
      );
    }

    const user: UserI | null = (await UserM.create({
      fullname,
      username,
      ...otherProps,
    })) as UserI | null;

    if (!user) {
      throw new Error("An error occurred when creating the user");
    }

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function isValidEmail({
  email,
}: {
  email: string;
}): Promise<UserI | null> {
  try {
    const existingUser: UserI | null = (await UserM.findOne({
      where: {
        email: email,
      },
    })) as UserI | null;

    if (existingUser) {
      return existingUser;
    }
    return null;
  } catch (error: any) {
    return null;
  }
}

export async function isValidUsername({
  username,
}: {
  username: string;
}): Promise<UserI | null> {
  try {
    const existingUser: UserI | null = (await UserM.findOne({
      where: {
        username: username,
      },
    })) as UserI | null;

    if (existingUser) {
      return existingUser;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function isValidUserId({
  user_id,
}: {
  user_id: number;
}): Promise<UserI | null> {
  const existingUser: UserI | null = (await UserM.findOne({
    where: {
      user_id: user_id,
    },
  })) as UserI | null;

  if (existingUser) {
    return existingUser;
  }
  return null;
}

export async function compareCredential(
  req: Request,
  res: Response
): Promise<number | string> {
  const { credential, password } = req.body;
  let user: UserI | null;
  try {
    if (!credential || !password) {
      throw new Error("Invalid credentials!");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(credential)) {
      user = (await UserM.findOne({
        where: { email: credential },
      })) as UserI | null;
    } else {
      user = (await UserM.findOne({
        where: { username: credential },
      })) as UserI | null;
    }

    if (!user) {
      throw new Error("User not found!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error("Incorrect password!");
    }

    return user.user_id;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getGoogleOAuthTokens({
  code,
}: {
  code: string;
}): Promise<GoogleTokensResult> {
  const client_id = process.env.GOOGLE_CLIENT_ID as string;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET as string;
  const redirect_uri =
    `${process.env.OAUTH_REDIRECT_URL}provider=google` as string;

  const url = "https:oauth2.googleapis.com/token";
  const values = {
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: "authorization_code",
  };

  const params = new URLSearchParams(values);
  try {
    const res = await axios.post<GoogleTokensResult>(url, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getGoogleUser({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUserResult> {
  try {
    const res = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getGithubOAuthTokens({
  code,
}: {
  code: string;
}): Promise<string> {
  try {
    const res: GithubTokensResult = (await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID as string,
        client_secret: process.env.GITHUB_CLIENT_SECRET as string,
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    )) as GithubTokensResult;

    return res.data.access_token;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getGithubUser({
  code,
}: {
  code: string;
}): Promise<GithubUserResult> {
  const url = "https://api.github.com/user";

  try {
    const res = await axios.get<GithubUserResult>(url, {
      headers: {
        Authorization: `token ${code}`,
        "User-Agent": "node.js",
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAddress({
  address_id,
}: {
  address_id: number;
}): Promise<AddressI | null> {
  if (!address_id) {
    return null;
  }
  const address: AddressI | null = (await AddressM.findOne({
    where: {
      address_id: address_id,
    },
  })) as AddressI | null;

  return address;
}

export async function changeEmail({
  user_id,
  email,
}: {
  user_id: number;
  email: string;
}): Promise<ChangePromise> {
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  if (!regex.test(email)) {
    return {
      msg: "Invalid email format.",
      status: 401,
    };
  }

  try {
    if (user_id) {
      const [affectedRowsCount] = await UserM.update(
        { email: email, verify_email: true },
        { where: { user_id: user_id } }
      );
      if (affectedRowsCount > 0) {
        return {
          msg: "Email updated successfully",
          status: 200,
        };
      } else {
        return {
          msg: "User not found or email not updated",
          status: 404,
        };
      }
    }
    return {
      msg: "THe field UserID is required!",
      status: 401,
    };
  } catch (error) {
    return {
      msg: "Error updating email",
      status: 500,
    };
  }
}

export async function changePhone({
  user_id,
  phone,
}: {
  user_id: number;
  phone: string;
}): Promise<ChangePromise> {
  const regex = /^\+?\d{1,3}[- ]?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;

  if (!regex.test(phone)) {
    return {
      msg: "Invalid phone format.",
      status: 401,
    };
  }

  try {
    if (user_id) {
      const [affectedRowsCount] = await UserM.update(
        { phone: phone, verify_phone: true },
        { where: { user_id: user_id } }
      );
      if (affectedRowsCount > 0) {
        return {
          msg: "Phone updated successfully",
          status: 200,
        };
      } else {
        return {
          msg: "User not found or phone not updated",
          status: 404,
        };
      }
    }
    return {
      msg: "The field UserID is required!",
      status: 401,
    };
  } catch (error) {
    return {
      msg: "Error updating phone",
      status: 500,
    };
  }
}

export async function changePassword({
  user_id,
  password,
}: {
  user_id: number;
  password: string;
}): Promise<ChangePromise> {
  try {
    if (user_id) {
      console.log(user_id);
      
      const [affectedRowsCount] = await UserM.update(
        { password_hash: password },
        { where: { user_id: user_id } }
      );
      if (affectedRowsCount > 0) {
        return {
          msg: "Password updated successfully",
          status: 200,
        };
      } else {
        return {
          msg: "User not found or password not updated",
          status: 404,
        };
      }
    }
    return {
      msg: "THe field UserID is required!",
      status: 401,
    };
  } catch (error) {
    return {
      msg: "Error updating password",
      status: 500,
    };
  }
}
