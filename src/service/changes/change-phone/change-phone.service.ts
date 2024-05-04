import { Request, Response } from "express";

async function changePhone(req:Request, res:Response) {
    res.status(200).json({msg: "OK"})
}
export {changePhone}