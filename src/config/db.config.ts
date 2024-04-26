import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
  "ecommerce",
  "root",
  "@13579Ff",
  {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    dialectModule: require('mysql2')
  }
);

// Exporte a instância do sequelize
export default sequelize;

// Verifique se este arquivo está sendo executado diretamente
if (require.main === module) {
  // Se estiver sendo executado diretamente, teste a conexão com o banco de dados
  const testarConexao = async () => {
    try {
      await sequelize.authenticate();
      console.log("Conexão bem-sucedida com o banco de dados.");
    } catch (error) {
      console.error("Erro ao conectar-se ao banco de dados:", error);
    }
  };
  
  // Chame a função para testar a conexão
  testarConexao();
}
