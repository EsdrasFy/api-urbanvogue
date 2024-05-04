import { Request, Response } from "express";

async function changePassword(req:Request, res:Response) {
    res.status(200).json({msg: "OK"})
}
export {changePassword}