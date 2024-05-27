import express, { Application } from "express";
import { routes } from "./routes";
import cors from "cors";
const app: Application = express();
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "https://github.com",
  "https://login-esdras.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(routes);

export default app;
