import { Request, Response } from "express";

async function changeEmail(req:Request, res:Response) {
    res.status(200).json({msg: "OK"})
}
export {changeEmail}