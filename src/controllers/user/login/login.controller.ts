require("dotenv").config();
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { UserM } from "../../../database/models/user/user.model";

async function login(req: Request, res: Response) {
  const cookies = new Cookies(req, res);
  const secret = process.env.SECRET;
  const token = cookies.get("jwt");
  const token2 = req.body.jwt;

  try {
    if (!token && !token2) {
      return res.status(401).json({ msg: "Token JWT ausente" });
    }
    if (!secret) {
      return res.status(401).json({ msg: "secret ausente" });
    }

    jwt.verify(
      token || token2,
      secret,
      async   (err: jwt.VerifyErrors | null, decodedToken: any) => {
        if (err) {
          return res.status(403).json({ error: "Token JWT inválido" });
        }
        const { id } = decodedToken;
        const user = await UserM.findOne({
          where: {
            user_id: id,
          },
        });

        return res
          .status(200)
          .json({ msg: "Login Successfull!", status: 200, user: user })
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal error!", error });
  }
}

export { login };
