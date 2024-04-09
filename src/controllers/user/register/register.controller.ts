import { registerCredential } from "./credential";
import { Request, Response } from "express";

async function register(req: Request, res: Response) {
    const type = req.params.type;

    if (type !== "social" && type !== "credential") {
      return res.status(401).json({ msg: "invalid register type!" });
    }
    if (type === "credential") {
     return await registerCredential(req, res,);
    }
}
export { register };
