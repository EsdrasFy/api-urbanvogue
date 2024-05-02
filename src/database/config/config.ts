import "dotenv/config";
import { Dialect, Options } from "sequelize";
const dialects: Dialect[] = ["mysql", "postgres", "sqlite", "mariadb", "mssql"];

const config: Options = {
  username: process.env.DB_USER || undefined,
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_NAME || undefined,
  host: process.env.DB_HOST || undefined,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  dialect: dialects.includes(process.env.DIALECT as Dialect)
    ? (process.env.DIALECT as Dialect)
    : "mysql",
  logging: process.env.LOGGING ? true : false,
};

export = config;
