import express, { Application } from "express";
import { routes } from "./routes";
import cors from "cors";
const app: Application = express();
import dotenv from "dotenv";
dotenv.config()

app.use(
    cors({
      credentials: true,
      origin: [
        "https://urbanvogue.vercel.app",
        "http://localhost:3000",
        "https://urbanvogue.cloud/",
        "http://192.168.1.12:3000"
      ],
      methods:['GET', 'POST', 'DELETE', 'PUT', 'PATCH']
    })
  );
  app.use(express.json());
  app.use(routes);
  
export default app;