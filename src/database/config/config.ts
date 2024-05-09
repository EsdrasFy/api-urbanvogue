require("dotenv").config();
import { Options } from "sequelize";

const config: Options = {
  username: "root" || undefined,
  password: "OIfLBnLXGcpPVLjktObWlsvBllgqGZAP" || undefined,
  database: "railway" || undefined,
  host: "viaduct.proxy.rlwy.net" || undefined,
  port: 37488,
  dialect: "mysql",
  dialectModule: require("mysql2"),
  logging: true,
};

export = config;
