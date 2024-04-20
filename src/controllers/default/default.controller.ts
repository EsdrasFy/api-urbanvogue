import { Request, Response } from "express";

async function defaultRoute(req: Request, res: Response) {
  res.status(200).send("Welcome urban vogue");
}

export { defaultRoute };
