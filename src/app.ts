import express, { Application } from "express";
import { routes } from "./routes";
import cors from "cors";
const app: Application = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/user/user.route"
import OAuthRoutes from "./routes/oauth/oauth.route"
dotenv.config();


const allowedOrigins = [
  "http://localhost:3000",
  "https://github.com",
  "https://login-esdras.vercel.app",
];

app
  .use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  )
  .use(express.json())
  .use(cookieParser())
  .use(routes)
  .use(UserRoutes)
  .use(OAuthRoutes)

export default app;
