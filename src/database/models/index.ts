import { Sequelize } from "sequelize";
import * as config from "../config/config";

const sequelize = new Sequelize(config);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão bem-sucedida com o banco de dados.");
  })
  .catch((error) => {
    console.error("Erro ao conectar-se ao banco de dados:", error);
  });

export default sequelize;
