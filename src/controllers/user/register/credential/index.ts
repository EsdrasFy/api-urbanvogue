require("dotenv").config();
import { UserM } from "../../../../database/models/user/user.model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserI } from "../../../../interfaces/user.interface";

async function registerCredential(req: Request, res: Response) {
  try {
    const { fullname, username, email, password_hash } = req.body;

    if (!username || username.length < 3) {
      return res
        .status(401)
        .json({ msg: "Incorrect user pattern!", status: 401 });
    }

    if (!fullname || fullname.length < 10) {
      return res.status(401).json({ msg: "Fullname required!", status: 401 });
    }

    if (!email) {
      return res.status(401).json({ msg: "Email required!", status: 401 });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res
        .status(401)
        .json({ msg: "Invalid email format!", status: 401 });
    }

    if (!password_hash || password_hash.length < 6) {
      return res.status(401).json({
        msg: "Weak password! Use a password with at least 6 characters.",
        status: 401,
      });
    }

    const existingEmail = (await UserM.findOne({
      where: { email: email },
    })) as UserI;
    if (existingEmail && existingEmail.email === email) {
      return res
        .status(401)
        .json({ msg: "Email is already in use.", status: 401 });
    }

    const existingUsername = await UserM.findOne({
      where: { username: username },
    });
    if (existingUsername) {
      return res
        .status(401)
        .json({ msg: "Username is already in use.", status: 401 });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password_hash, salt);

    const usuario = await UserM.create({
      fullname,
      username,
      email,
      password_hash: passwordHash,
    });

    res.status(201).json({ user: usuario });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ msg: "Erro ao criar usuário" });
  }
}

export { registerCredential };
