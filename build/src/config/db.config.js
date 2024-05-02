"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require("dotenv/config");
const sequelize = new sequelize_1.Sequelize("ecommerce", "root", "@13579Ff", {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    dialectModule: require('mysql2')
});
// Exporte a instância do sequelize
exports.default = sequelize;
// Verifique se este arquivo está sendo executado diretamente
if (require.main === module) {
    // Se estiver sendo executado diretamente, teste a conexão com o banco de dados
    const testarConexao = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield sequelize.authenticate();
            console.log("Conexão bem-sucedida com o banco de dados.");
        }
        catch (error) {
            console.error("Erro ao conectar-se ao banco de dados:", error);
        }
    });
    // Chame a função para testar a conexão
    testarConexao();
}
