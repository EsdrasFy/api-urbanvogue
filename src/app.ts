import express, { Application } from "express";
import { routes } from "./routes";
import cors from "cors";
const app: Application = express();
import dotenv from "dotenv";
dotenv.config();

const corsOptions = {
  origin: ["http://localhost:3000", "https://urbanvogue.cloud", "https://github.com", "https://accounts.google.com", "https://api.urbanvogue.cloud"],
  methods: ["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
  allowedHeaders: ["X-CSRF-Token", "X-Requested-With", "Accept", "Accept-Version", "Content-Length", "Content-MD5", "Content-Type", "Date", "X-Api-Version"],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(routes);

export default app;
