import express from "express";
import { routes } from "./routes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const app = express();

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

try {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
  });
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}
