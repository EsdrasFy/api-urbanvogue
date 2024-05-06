import dotenv from "dotenv";
import app from "./app";
import "./service/whatsapp-web/whatsapp-web.service"
dotenv.config();

const PORT = process.env.PORT;

try {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
  });
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}
