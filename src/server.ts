import dotenv from "dotenv";
import app from "./app";
// import "./service/whatsapp-web/whatsapp-web.service";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
app.use(cookieParser());
const PORT = process.env.PORT;
const allowedOrigins = [
  "http://localhost:3000",
  "https://github.com",
  "https://urbanvogue.cloud",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
try {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
  });
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}
