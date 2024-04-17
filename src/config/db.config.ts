import { Sequelize } from "sequelize";
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "",
    port: 34331,
    dialect: "mysql",
    dialectModule: require('mysql2')
  }
);

export default sequelize;

const testarConexao = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão bem-sucedida com o banco de dados.");
  } catch (error) {
    console.error("Erro ao conectar-se ao banco de dados:", error);
  }
};
testarConexao();
