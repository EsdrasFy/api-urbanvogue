require("dotenv").config();
import { UserM } from "../../../models/user/user.model";
import { Request, Response } from "express";
import { UserI } from "../../../interfaces/user.interface";

  async function readUser(req: Request, res: Response) {
    const id = req.params.id;
    try {
      if (!id) {
        return res.status(404).json({ msg: "The field id is required!" });
      }
      const user = (await UserM.findOne({
        where: { user_id: id },
      })) as UserI;
      
      if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    console.log(user);
    res
    .status(200)
    .json({ user, status: 200, id: user.user_id, name: user.username });
  } catch (error) {
    res.status(500).json({ msg: "Internal Error!" });
  }
}
async function updateUser(req: Request, res: Response) {
  const {
    user_id,
    fullname,
    username,
    email,
    profile_img,
    birthdate,
    phone,
    gender,
    cpf,
  } = req.body;
  if (!username || username.length < 3) {
    return res.status(401).json({ msg: "Incorrect user pattern!" });
  }
  if (!fullname || fullname.length < 8) {
    return res.status(401).json({ msg: "Full name required!" });
  }
  if (!email) {
    return res.status(401).json({ msg: "Email required!" });
  }
  
  try {
    const user = (await UserM.findOne({
      where: {
        user_id: user_id,
      },
    })) as UserI;

    const existingCPF = (await UserM.findOne({
      where: {
        cpf: cpf,
      },
    })) as UserI;

    let image: string;

    if (!profile_img) {
      image = user.profile_img;
    }

    if (existingCPF && existingCPF.user_id !== user.user_id) {
      return res.status(400).json({ msg: "CPF is already in use." });
    }

    const existingEmail = (await UserM.findOne({
      where: {
        email: email,
      },
    })) as UserI;

    if (existingEmail && existingEmail.user_id !== user.user_id) {
      return res.status(400).json({ msg: "Email is already in use." });
    }

    const existingUsername = (await UserM.findOne({
      where: {
        username: username,
      },
    })) as UserI;

    if (existingUsername && existingUsername.user_id !== user.user_id) {
      return res.status(400).json({ msg: "Username is already in use." });
    }

    await UserM.update(
      {
        username: username,
        fullname: fullname,
        email: email,
        profile_img: profile_img,
        password_hash: user.password_hash,
        date_of_birth: birthdate,
        phone: phone,
        gender: gender,
        cpf: cpf,
      },
      {
        where: { user_id: user_id },
      }
    );
    const updatedUser = await UserM.findOne({ where: { user_id: user_id } });
    
    return res.status(200).json({ msg: "Successful update!", user: updatedUser });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "Error updating user!", user: null });
  }
}
async function deleteUser(req: Request, res: Response) {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ msg: "ID is required in the request." });
    }

    const existingUser = (await UserM.findOne({
      where: {
        user_id: id,
      },
    })) as UserI;

    if (!existingUser) {
      return res.status(404).json({ msg: "User not found." });
    }

    await UserM.destroy({
      where: { user_id: id },
    });

    res.status(200).json({
      msg: `User with ID ${id} has been deleted from the database.`,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting user!" });
  }
}

export { updateUser, deleteUser, readUser };
