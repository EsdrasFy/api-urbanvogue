import { Request, Response } from "express";

const Logout = async (req: Request, res: Response) => {
  const token = req.cookies.jwt;
  console.log("teste");
  if (!token) {
    return res.status(200).json({ msg: "Without login" });
  }

  return res
    .cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 0,
    })
    .status(200)
    .json({ msg: "User logged out" });
};

export { Logout };
