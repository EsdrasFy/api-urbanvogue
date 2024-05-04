import Cookies from "cookies";
import { NextFunction, Request, Response } from "express";
require("dotenv").config();

async function codeReceived(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { change, code: codeFromRequest } = req.query;
  
    if (!change || !codeFromRequest) {
      return res.status(401).json({ msg: "The fields change and code are required." });
    }
  
    const cookies = new Cookies(req, res);
    const codeCookie = cookies.get(change as string) as string | undefined;
  
    if (!codeCookie) {
      return res.status(401).json({ msg: "Cookie not found." });
    }
  
    let cookieData;
    try {
      cookieData = JSON.parse(codeCookie);
      
    } catch (error) {
      return res.status(401).json({ msg: "Error parsing cookie data." });
    }
  
    if (!cookieData || typeof cookieData.code !== 'string' || typeof cookieData.data !== 'string') {
      return res.status(401).json({ msg: "Invalid cookie data format." });
    }
  
    const { code: codeFromCookie } = cookieData;
  
    if (codeFromCookie !== codeFromRequest) {
      return res.status(401).json({ msg: "Invalid code." });
    }
  
    next();
  }

export { codeReceived };
