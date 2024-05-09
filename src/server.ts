import dotenv from "dotenv";
import app from "./app";
import cors from "cors";
import "./service/whatsapp-web/whatsapp-web.service";
dotenv.config();

const PORT = process.env.PORT;
const corsOptions = {
  origin: ["http://localhost:3000", "https://urbanvogue.cloud", "https://github.com", "https://accounts.google.com", "https://api.urbanvogue.cloud"],
  methods: ["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
  allowedHeaders: ["X-CSRF-Token", "X-Requested-With", "Accept", "Accept-Version", "Content-Length", "Content-MD5", "Content-Type", "Date", "X-Api-Version"],
  credentials: true
};

app.use(cors(corsOptions));

try {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
  });
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}
