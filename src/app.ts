import express, { Application } from "express";
import { routes } from "./routes";
import cors from "cors";
const app: Application = express();

app.use(
    cors({
      credentials: true,
      origin: [
        "https://urbanvogue.vercel.app",
        "http://localhost:3000",
        "https://urbanvogue.cloud",
        "http://192.168.1.12:3000"
      ],
    })
  );
  
  app.use(express.json());
  app.use(routes);

  
export default app;