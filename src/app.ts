import express, { Application } from "express";
import { routes } from "./routes";
import cors from "cors";
const app: Application = express();
import dotenv from "dotenv";
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(routes);

export default app;
