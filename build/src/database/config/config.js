"use strict";
require("dotenv/config");
const dialects = ["mysql", "postgres", "sqlite", "mariadb", "mssql"];
const config = {
    username: process.env.DB_USER || undefined,
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_NAME || undefined,
    host: process.env.DB_HOST || undefined,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    dialect: dialects.includes(process.env.DIALECT)
        ? process.env.DIALECT
        : "mysql",
    logging: process.env.LOGGING ? true : false,
};
module.exports = config;
