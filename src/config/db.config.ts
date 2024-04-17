import { Sequelize } from "sequelize";
require("dotenv").config();
const sequelize = new Sequelize(
  "railway",
  "root",
  "DnYQQjCZnCskNmMswBIKdxYdipregdFM",
  {
    host: "viaduct.proxy.rlwy.net",
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
