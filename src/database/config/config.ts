require("dotenv").config();
import { Options } from "sequelize";

const config: Options = {
  username: "root",
  password: "OIfLBnLXGcpPVLjktObWlsvBllgqGZAP",
  database: "railway",
  host: "viaduct.proxy.rlwy.net",
  port: 37488,
  dialect: "mysql",
  dialectModule: require("mysql2"),
  logging: true,
};

export = config;
